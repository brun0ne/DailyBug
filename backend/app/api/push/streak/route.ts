import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/admin_auth";
import { db } from "@/lib/db";
import DateDiff from "date-diff";
import random from "random";

const titles: string[] = [
    "One bug a day...",
    "Bugs waiting!",
    "Oh, a bug?",
    "Daily Bug"
];

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    const authHeader = request.headers.get("authorization");
    if (!session && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({success: false, reason: "Access denied"}, { status: 403 });
    }

    /* Grab all users' with push notification tokens IDs */
    const users = await db.selectFrom("users")
        .select(["id", "streak", "last_streak_time", "push_token"])
        .execute();

    /* Checks for each */
    const now = new Date();

    const idsWhereShouldBeReset: number[] = [];
    const idsWhereAlreadyDoneToday: number[] = []; 
    
    for (const user of users) {
        const diffDays = Math.floor(new DateDiff(now, new Date(user.last_streak_time)).days());
        
        if (diffDays > 1) {
            /* reset to 0 */
            idsWhereShouldBeReset.push(user.id);
        }
        else if (diffDays == 0) {
            /* already done */
            idsWhereAlreadyDoneToday.push(user.id);
        }
    }
    
    /* write to DB*/
    await db.updateTable("users")
        .set("streak", 0)
        .where("id", "in", idsWhereShouldBeReset)
        .execute();

    /* send PUSH to all users with a token and Streak > 0 */
    for (const user of users) {
        if (!user.push_token || user.push_token === "")
            continue;
        if (idsWhereShouldBeReset.includes(user.id) || idsWhereAlreadyDoneToday.includes(user.id))
            continue;

        console.log("Sending PUSH to", user.push_token);

        const title = random.choice(titles);
        const body = random.choice([
            `Save your streak! (${user.streak})`,
            `Don't forget about your streak! (${user.streak})`,
            `Find just one bug to save your streak! (${user.streak})`,
            `New buggy code waits for you!`
        ]);

        const message = {
            to: user.push_token,
            sound: 'default',
            title: title,
            body: body,
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
