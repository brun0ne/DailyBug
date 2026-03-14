import { NextRequest, NextResponse } from "next/server";
import { formatInTimeZone } from 'date-fns-tz';

import { auth } from 'firebase-admin';
import { initFirebaseApp } from "@/lib/user_auth";

import DateDiff from "date-diff";

import { db } from "@/lib/db";
import { getMaxExp, randomReward } from "@/lib/rewards";
import { loadOwnedItems, saveOwnedItems } from "@/lib/items";

initFirebaseApp();

export async function POST(request: NextRequest) {
    const idToken = request.headers.get("idToken") as string;
    const data = await request.json() as { correct: boolean, timezone: string };

    try {
        const decodedToken = await auth().verifyIdToken(idToken);
    
        if (data.correct) {
            /* grab id, Combo, Streak + date, EXP, Level, Currency */
            const { id: user_id, combo, exp, level, streak, last_streak_time, currency } = await db.selectFrom("users")
                .select(["id", "combo", "exp", "level", "streak", "last_streak_time", "currency"])
                .where("uid", "=", decodedToken.uid)
                .executeTakeFirstOrThrow();

            /* determine reward */
            const reward = randomReward(streak, combo);
            console.log(reward);

            /* set incremented Combo */
            const new_combo = combo + 1;
            await db.updateTable("users").set("combo", new_combo).where("uid", "=", decodedToken.uid).execute();

            /* calculate incremented */
            const new_exp = reward.type === 'exp' ? (exp + reward.value) : exp;
            const new_currency = reward.type === 'currency' ? (currency + reward.value) : currency;

            /* calculate maxExp (needed to the next level) */
            const maxExp = getMaxExp(level);
            
            let mut_exp = new_exp;
            if (new_exp >= maxExp) {
                let mut_level = level;

                while (mut_exp >= maxExp) {
                    mut_exp -= maxExp;
                    mut_level++;
                }

                /* set fixed Level */
                await db.updateTable("users").set("level", mut_level).where("uid", "=", decodedToken.uid).execute();
            }

            /* set incremented */
            if (exp !== mut_exp)
                await db.updateTable("users").set("exp", mut_exp).where("uid", "=", decodedToken.uid).execute();
            if (currency !== new_currency)
                await db.updateTable("users").set("currency", new_currency).where("uid", "=", decodedToken.uid).execute();

            /* grab datetimes */
            let now = new Date(new Date().toLocaleString("en-US", {timeZone: data.timezone}));

            /* increment Streak if date difference == 1 day */
            const last_streak_time_date = new Date(last_streak_time);
            const diffDays = Math.floor(new DateDiff(
                new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                new Date(last_streak_time_date.getFullYear(), last_streak_time_date.getMonth(), last_streak_time_date.getDate()),
            ).days());

            if (diffDays === 1) {
                const {streak} = await db.selectFrom("users")
                    .select("streak")
                    .where("uid", "=", decodedToken.uid)
                    .executeTakeFirstOrThrow();

                await db.updateTable("users")
                    .set("streak", streak+1)
                    .where("uid", "=", decodedToken.uid)
                    .execute();

                console.log(`Streak incremented, diffDays: ${diffDays}`);
            }
            else if (diffDays > 1) {
                let saved = false;

                /* check if a Saver is activated */
                const items = await loadOwnedItems(user_id);
                if (items.Saver.active) {
                    items.Saver.active = false;
                    items.Saver.amount -= 1;
                    await saveOwnedItems(user_id, items);

                    /* do not reset the Streak if only 1 additional day went by */
                    if (diffDays === 2) {
                        saved = true;
                    }
                }

                if (!saved) {
                    /* reset */
                    if (streak !== 1) {
                        await db.updateTable("users")
                            .set("streak", 1)
                            .where("uid", "=", decodedToken.uid)
                            .execute();
                    }

                    console.log(`Streak reset, diffDays: ${diffDays}`);
                }
                else {
                    console.log(`Streak saved, diffDays: ${diffDays}`);
                }
            }

            /* set current datetime for Streak calculation */
            const timestamp = formatInTimeZone(new Date(), data.timezone, "yyyy-MM-dd HH:mm:ss");
            await db.updateTable("users").set("last_streak_time", timestamp).where("uid", "=", decodedToken.uid).execute();
        
            return NextResponse.json({reward: reward}, {status: 200});
        }
        /* if not correct */
        else {
            /* reset Combo to 0 */
            await db.updateTable("users").set("combo", 0).where("uid", "=", decodedToken.uid).execute();

            return NextResponse.json({success: true}, {status: 200});
        }
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({success: false}, {status: 403});
    }
}

export const revalidate = 0;
