import { NextRequest, NextResponse } from "next/server";

import { auth } from 'firebase-admin';
import { initFirebaseApp } from "@/lib/user_auth";

import { db } from "@/lib/db";

initFirebaseApp();

export async function POST(request: NextRequest) {
    const idToken = request.headers.get("idToken") as string;
    const data = await request.json() as { expoPushToken: string };

    try {
        const decodedToken = await auth().verifyIdToken(idToken);
    
        /* check if already there */
        const res = await db.selectFrom("users").select("uid").where("uid", "=", decodedToken.uid).execute();
        
        if (res.length > 0) {
            console.log("User already exists");

            if (data.expoPushToken && data.expoPushToken !== "") {
                /* update push token */
                db.updateTable("users")
                    .set("push_token", data.expoPushToken)
                    .where("uid", "=", decodedToken.uid)
                    .execute();
            }

            return NextResponse.json({success: false, reason: "already_exists"}, {status: 200});
        }

        /* add user to DB */
        db.insertInto("users")
            .values({
                uid: decodedToken.uid,
                push_token: data.expoPushToken ?? ""
            })
            .onConflict((oc) => (oc.column("uid").doNothing()))
            .execute();

        return NextResponse.json({success: true}, {status: 200});
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({success: false}, {status: 403});
    }
};

export const revalidate = 0;
