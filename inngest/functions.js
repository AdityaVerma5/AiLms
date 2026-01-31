import { db } from "@/configs/db";
import { inngest } from "./client";
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE, STUDY_TYPE_CONTENT_TABLE, USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { generateNotes, GenerateQuizAiModel, GenerateStudyTypeContentAiModel } from "@/configs/AiModel";
import { sendMessageWithRetry } from "@/lib/gemini";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello, World!" };
  },
);

export const CreateNewUser = inngest.createFunction(
    {id: "create-user"},
    {event: "user.create"},
    async ({event,step}) => {
        const {user} = event.data;
        // Get Event Data
        const result = await step.run('Check User and create if not exists', async () => {
            const email = user?.email;
            const existing = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, email));

            if (existing?.length === 0 && user?.fullName && email) {
                const userResp = await db.insert(USER_TABLE).values({
                    name: user.fullName,
                    email,
                    isMember: false,
                }).returning({ id: USER_TABLE.id });
                return userResp;
            }
            return existing;
        })

        return 'Success'
    }

)

export const GenerateNotes = inngest.createFunction(
    { id: "generate-course" },
    { event: "notes.generate" },
    async ({ event, step }) => {
        const { course } = event.data; // All Record info

        // Generate Notes for each chapter using AI
        const notesResult = await step.run("Generate Notes", async () => {
            const Chapters = course?.courseLayout?.chapters || [];
            if (!Array.isArray(Chapters)) {
                throw new Error("Chapters is not defined or not an array.");
            }

            await Promise.all(
                Chapters.map(async (chapter, index) => {
                    const PROMPT = `Generate exam material detail content for each chapter , Make sure to includes all topic point in the content, make sure to give content in HTML format (Do not Add HTMLK , Head, Body, title tag), The chapters: ${JSON.stringify(chapter)}`;
                    const result = await sendMessageWithRetry(generateNotes, PROMPT);
                    const aiResp = await result.response.text();

                    await db.insert(CHAPTER_NOTES_TABLE).values({
                        chapterId: index,
                        courseId: course?.courseId,
                        notes: aiResp,
                    });
                })
            );

            return "Completed";
        });

        // Update Status to Ready
        const updateCourseStatusResult = await step.run("Update Course Status", async () => {
            await db
                .update(STUDY_MATERIAL_TABLE)
                .set({ status: "Ready" })
                .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));
            return "Success";
        });

        return "Success";
    }
);

// Used to generate flashcards, quiz and Q/A
export const GenerateStudyTypeContent = inngest.createFunction(
    { id: "Generate Study Type Content" },
    { event: "studyType.content" },


    async ({ event, step }) => {
        const {studyType,prompt,courseId,recordId} = event.data;

            const AiResult = await step.run("Generate Flashcards", async () => {
            const result =
            studyType === 'Flashcard'
                ? await sendMessageWithRetry(GenerateStudyTypeContentAiModel, prompt)
                : await sendMessageWithRetry(GenerateQuizAiModel, prompt);
            const AiResult = JSON.parse(result.response.text());
            return AiResult;
            });

        // Save the result to DB

        const DbResult = await step.run('Saving result to DB', async()=>{
            const result = await db.update(STUDY_TYPE_CONTENT_TABLE)
            .set({
                content: AiResult,
                status:'Ready'
            }).where(eq(STUDY_TYPE_CONTENT_TABLE.id,recordId))

            return 'Data Saved'
        })

    }

)
