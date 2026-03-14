import { NextRequest, NextResponse } from "next/server";

import { auth } from 'firebase-admin';
import { initFirebaseApp } from "@/lib/user_auth";

import { db } from "@/lib/db";
import { AllItems, loadOwnedItems, saveOwnedItems } from "@/lib/items";
import { randomSprint } from "@/lib/rewards";

initFirebaseApp();

export async function POST(request: NextRequest) {
    const idToken = request.headers.get("idToken") as string;

    try {
        const decodedToken = await auth().verifyIdToken(idToken);
        const COST = 150;
    
        /* grab user's id, currency, streak, combo, pity, sprints */
        const {id: user_id, currency, streak, combo, pity4, pity5, sprints} = await db.selectFrom("users")
            .select(["id", "currency", "streak", "combo", "pity4", "pity5", "sprints"])
            .where("uid", "=", decodedToken.uid)
            .executeTakeFirstOrThrow();

        if (currency < COST) {
            /* not enough */
            return NextResponse.json({success: false, reason: `SP < ${COST}`}, {status: 500});
        }

        /* decrease by COST */
        const newCurrency = currency - COST;
        await db.updateTable("users")
            .set("currency", newCurrency)
            .where("uid", "=", decodedToken.uid)
            .execute();

        /* reward */
        const CONVERT_CURRENCY = 500;
        let converted = false;
        let currency_after_convert = currency;

        const items = await loadOwnedItems(user_id);
        const pulledItemName = randomSprint(streak, combo, items, pity4, pity5, sprints);

        if (items[pulledItemName].maxOne && items[pulledItemName].amount > 0) {
            converted = true;
            currency_after_convert = currency + CONVERT_CURRENCY;
        }
        else {
            items[pulledItemName].amount += 1;
            await saveOwnedItems(user_id, items);
        }

        /* update pity */
        let new_pity4 = pity4;
        let new_pity5 = pity5;

        if (items[pulledItemName].stars === 3) {
            new_pity4 = pity4 + 1;
            new_pity5 = pity5 + 1;
        }
        else if (items[pulledItemName].stars === 4) {
            new_pity4 = 0;
            new_pity5 = pity5 + 1;
        }
        else if (items[pulledItemName].stars === 5) {
            new_pity4 = 0;
            new_pity5 = 0;
        }

        await db.updateTable("users")
            .set("pity4", new_pity4)
            .set("pity5", new_pity5)
            .set("sprints", sprints + 1)
            .where("uid", "=", decodedToken.uid)
            .execute();

        if (converted) {
            await db.updateTable("users")
                .set("currency", currency_after_convert)
                .where("uid", "=", decodedToken.uid)
                .execute();
        }

        return NextResponse.json({
            success: true,
            reward: AllItems[pulledItemName],
            itemName: pulledItemName,
            converted: (converted ? CONVERT_CURRENCY : false)
        }, {
            status: 200
        });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({success: false}, {status: 403});
    }
};

export const revalidate = 0;
