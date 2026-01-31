import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const user = body?.user;

        if (!user?.email) {
            return NextResponse.json(
                { error: "Missing user email" },
                { status: 400 }
            );
        }

        const result = await inngest.send({
            name: "user.create",
            data: { user },
        });

        return NextResponse.json({ result });
    } catch (err) {
        console.error("create-user API error:", err);
        return NextResponse.json(
            { error: err.message ?? "Internal server error" },
            { status: 500 }
        );
    }
}