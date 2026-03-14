import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/admin_auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({success: false, reason: "Access denied"}, { status: 403});
    }

    /* Update DB */
    try {
        await db.insertInto("bugs").values({
            language: "javascript",
            difficulty: 1,
            hint: "Here should be a hint!",
            answer: 0,
            body: `/* write code here */`,
            explanation: "Write an explanation here :)"
        }).execute();

        const bug = await db.selectFrom("bugs")
            .selectAll()
            .orderBy("id", "desc")
            .limit(1)
            .executeTakeFirstOrThrow();

        return NextResponse.json({ success: true, bug: bug }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export const revalidate = 0;
