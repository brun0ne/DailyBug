import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import secret from "@/lib/secret";

export async function GET(request: NextRequest) {
    /* validate token */
    if (request.headers.get("Secret") !== secret) {
        return NextResponse.json({success: false});
    }

    const all = await db.selectFrom("bugs").select(["id", "answer", "language", "hint", "body", "explanation"]).execute();
    return NextResponse.json(all);
};

export const revalidate = 0;
