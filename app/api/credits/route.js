import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE, USER_TABLE } from "@/configs/schema";
import { getCreditLimit } from "@/lib/credits";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * GET /api/credits?createdBy=user@example.com
 * Returns { used, limit } where limit is 5 for free users, null for unlimited.
 */
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const createdBy = searchParams.get("createdBy");
        if (!createdBy) {
            return NextResponse.json(
                { error: "Missing createdBy (user email)" },
                { status: 400 }
            );
        }

        const [user] = await db.select({ isMember: USER_TABLE.isMember }).from(USER_TABLE).where(eq(USER_TABLE.email, createdBy));
        const limit = getCreditLimit(createdBy, user?.isMember ?? false);

        const [row] = await db.select({ count: sql`count(*)::int` }).from(STUDY_MATERIAL_TABLE).where(eq(STUDY_MATERIAL_TABLE.createdBy, createdBy));
        const used = row?.count ?? 0;

        return NextResponse.json({ used, limit });
    } catch (err) {
        console.error("credits API error:", err);
        return NextResponse.json(
            { error: err.message ?? "Failed to get credits" },
            { status: 500 }
        );
    }
}
