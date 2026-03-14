import { NextRequest, NextResponse } from "next/server";

import { auth } from 'firebase-admin';
import { initFirebaseApp } from "@/lib/user_auth";

import { db } from "@/lib/db";
import { loadOwnedItems, saveOwnedItems } from "@/lib/items";

initFirebaseApp();

export async function POST(request: NextRequest) {
    const idToken = request.headers.get("idToken") as string;

    try {
        const decodedToken = await auth().verifyIdToken(idToken);
    
        /* grab user's id */
        const {id: user_id} = await db.selectFrom("users")
            .select(["id"])
            .where("uid", "=", decodedToken.uid)
            .executeTakeFirstOrThrow();

        /* grab items, check if Skip is owned */
        const items = await loadOwnedItems(user_id);

        if (items.Skip.amount <= 0)
            return;

        /* take one */
        items.Skip.amount -= 1;
        await saveOwnedItems(user_id, items);

        return NextResponse.json({success: true}, {status: 200});
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({success: false}, {status: 403});
    }
};

export const revalidate = 0;
