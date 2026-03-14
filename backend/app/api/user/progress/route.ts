import { NextRequest, NextResponse } from "next/server";

import { auth } from 'firebase-admin';
import { initFirebaseApp } from "@/lib/user_auth";

import { db } from "@/lib/db";
import DateDiff from "date-diff";
import { getChances, getMaxExp } from "@/lib/rewards";
import { canFeedDuck, loadOwnedItems } from "@/lib/items";

initFirebaseApp();

export async function GET(request: NextRequest) {
    const idToken = request.headers.get("idToken") as string;

    try {
        const decodedToken = await auth().verifyIdToken(idToken);

        /* get user id, STREAK, COMBO, LEVEL and EXP, CURRENCY */
        const {id: user_id, ...data} = await db.selectFrom("users")
            .select(["id", "streak", "last_streak_time", "combo", "level", "exp", "currency"])
            .where("uid", "=", decodedToken.uid)
            .executeTakeFirstOrThrow();

        /* check if Streak should be reset to 0 */
        const now = new Date();
        const diffDays = Math.floor(new DateDiff(now, new Date(data.last_streak_time)).days());

        let streak = data.streak;

        if (diffDays > 1) {
            /* reset to 0 */
            if (data.streak !== 0) {
                streak = 0;
                await db.updateTable("users").set("streak", 0).where("users.uid", "=", decodedToken.uid).execute();
            }
        }

        /* calculate maxExp (needed to the next level) */
        const maxExp = getMaxExp(data.level);

        /* get ITEMS */
        const items = await loadOwnedItems(user_id);

        /* get chances */
        const chances = getChances(streak, data.combo, items);

        /* other */
        const other = {
            canFeedDuck: await canFeedDuck(user_id, items)
        };
        
        return NextResponse.json({maxExp, ...data, items, chances: {5: chances[5] * 100, 4: chances[4] * 100}, other}, {status: 200});
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({success: false}, {status: 403});
    }
};

export const revalidate = 0;
