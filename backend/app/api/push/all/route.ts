import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/admin_auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const data = await request.json() as {title?: string, body?: string};

    if (!session) {
        return NextResponse.json({success: false, reason: "Access denied"}, { status: 403 });
    }

    if (!data || !data.title || !data.body) {
        return NextResponse.json({success: false, reason: "Wrong arguments"}, { status: 500 });
    }

    /* Get all valid push notification tokens */
    const tokens = await db.selectFrom("users").select("push_token").execute();

    for (const { push_token } of tokens) {
        if (!push_token || push_token === "")
            continue;

        console.log("Sending PUSH to", push_token);

        const message = {
            to: push_token,
            sound: 'default',
            title: data.title,
            body: data.body,
            data: {}
        };
        
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}

export const revalidate = 0;
