import { courseOutline } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { sendMessageWithRetry } from "@/lib/gemini";
import { STUDY_MATERIAL_TABLE, USER_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { FREE_CREDIT_LIMIT, isWhitelisted } from "@/lib/credits";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

/** Extract JSON from AI response (handles markdown code blocks) */
function parseAiJson(raw) {
    const str = typeof raw === "string" ? raw : String(raw ?? "");
    const jsonMatch = str.match(/```(?:json)?\s*([\s\S]*?)```/) ?? [null, str];
    const toParse = jsonMatch[1]?.trim() || str.trim();
    return JSON.parse(toParse);
}

export async function POST(req) {
    try {
        const body = await req.json().catch(() => ({}));
        const { courseId, topic, studyType, difficultyLevel, createdBy } = body;

        if (!courseId || !topic || !studyType || !createdBy) {
            return NextResponse.json(
                { error: "Missing required fields: courseId, topic, studyType, createdBy" },
                { status: 400 }
            );
        }

        // Enforce free credit cap (5); whitelisted emails and paid members get unlimited
        if (!isWhitelisted(createdBy)) {
            const [user] = await db.select({ isMember: USER_TABLE.isMember }).from(USER_TABLE).where(eq(USER_TABLE.email, createdBy));
            const isMember = user?.isMember ?? false;
            if (!isMember) {
                const [row] = await db.select({ count: sql`count(*)::int` }).from(STUDY_MATERIAL_TABLE).where(eq(STUDY_MATERIAL_TABLE.createdBy, createdBy));
                const used = row?.count ?? 0;
                if (used >= FREE_CREDIT_LIMIT) {
                    return NextResponse.json(
                        { error: `You've used all ${FREE_CREDIT_LIMIT} free credits. Upgrade to create more courses.` },
                        { status: 403 }
                    );
                }
            }
        }

        const PROMPT = `Generate a study material for ${topic} for ${studyType} and level of difficulty will be ${difficultyLevel ?? "Easy"} with summary of course, List of Chapters along with summary and Emoji icon for each chapter, Topic list in each chapter in JSON format`;

        const aiResp = await sendMessageWithRetry(courseOutline, PROMPT);
        const text = aiResp?.response?.text?.() ?? aiResp?.response?.text ?? "";
        const aiResult = parseAiJson(text);

        const dbResult = await db.insert(STUDY_MATERIAL_TABLE).values({
            courseId,
            courseType: studyType,
            createdBy,
            topic,
            courseLayout: aiResult,
            difficultyLevel: difficultyLevel ?? "Easy",
        }).returning({ resp: STUDY_MATERIAL_TABLE });

        await inngest.send({
            name: "notes.generate",
            data: { course: dbResult[0].resp },
        });

        return NextResponse.json({ courseOutline: dbResult[0] });
    } catch (err) {
        console.error("generate-course-outline API error:", err);
        return NextResponse.json(
            { error: err.message ?? "Failed to generate course outline" },
            { status: 500 }
        );
    }
}