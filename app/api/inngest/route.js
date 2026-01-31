import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { CreateNewUser, GenerateNotes, GenerateStudyTypeContent, helloWorld } from "@/inngest/functions";

// Use Node runtime so Inngest functions can use Drizzle and Gemini (Edge has limitations)
// export const runtime = 'edge' removed for local/production function execution

// Create an API that serves Inngest functions
export const {GET, POST, PUT } = serve({
    client: inngest,
    streaming: 'allow',
    functions: [
        /* your functions will be passed here later! */
        helloWorld,
        CreateNewUser,
        GenerateNotes,
        GenerateStudyTypeContent
    ],
});


