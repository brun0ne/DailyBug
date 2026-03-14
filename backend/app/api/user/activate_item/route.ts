import { NextRequest, NextResponse } from "next/server";

import { auth } from 'firebase-admin';
import { initFirebaseApp } from "@/lib/user_auth";

import { db } from "@/lib/db";
import { canFeedDuck, loadOwnedItems, saveOwnedItems } from "@/lib/items";
import DateDiff from "date-diff";

initFirebaseApp();

export async function POST(request: NextRequest) {
    const idToken = request.headers.get("idToken") as string;
    const data = await request.json() as { itemName?: string, timezone: string };

    try {
        const decodedToken = await auth().verifyIdToken(idToken);
        
        if (data.itemName === "Saver") {
            const { id: user_id } = await db.selectFrom("users")
                .select("id")
                .where("uid", "=", decodedToken.uid)
                .executeTakeFirstOrThrow();
            
            const items = await loadOwnedItems(user_id);
            
            if (items.Saver.amount <= 0 || items.Saver.active) {
                return NextResponse.json({success: false, reason: "Cannot activate"}, {status: 500});
            }

            /* everything is ok */
            items.Saver.active = true;
            await saveOwnedItems(user_id, items);
        
            return NextResponse.json({success: true}, {status: 200});
        }
        else if (data.itemName === "Rubber Duck") {
            const { id: user_id } = await db.selectFrom("users")
                .select("id")
                .where("uid", "=", decodedToken.uid)
                .executeTakeFirstOrThrow();
            
            const items = await loadOwnedItems(user_id);

            const can = await canFeedDuck(user_id, items);
            if (!can) {
                return NextResponse.json({success: false, reason: "Cannot feed yet"}, {status: 500});
            }

            const timestamp = new Date().toLocaleString("en-US", {timeZone: data.timezone});

            items.Cookie.amount -= 1;
            if (!items["Rubber Duck"].special) {
                items["Rubber Duck"].special = {
                    level: 2,
                    last_fed: timestamp
                };
            }
            else {
                items["Rubber Duck"].special.level += 1;
                items["Rubber Duck"].special.last_fed = timestamp;
            }

            saveOwnedItems(user_id, items);

            return NextResponse.json({success: true}, {status: 200});
        }
        else {
            return NextResponse.json({success: false, reason: "Unsupported item"}, {status: 500});
        }
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({success: false}, {status: 403});
    }
};

export const revalidate = 0;
