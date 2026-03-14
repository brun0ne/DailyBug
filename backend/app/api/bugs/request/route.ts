import { NextRequest, NextResponse } from "next/server";
import { Bug, db, sql } from "@/lib/db";
import { initFirebaseApp } from "@/lib/user_auth";
import { auth } from "firebase-admin";
import { generateBug } from "@/lib/bug_generator";

initFirebaseApp();

export async function GET(request: NextRequest) {
    /* return a random Bug */
    const idToken = request.headers.get("idToken") as string;

    try {
        const decodedToken = await auth().verifyIdToken(idToken);
    
        const { id: user_id, combo } = await db.selectFrom("users")
            .select(["id", "combo"])
            .where("uid", "=", decodedToken.uid)
            .executeTakeFirstOrThrow();

        let upperDifficultyBound: 3 | 2 | 1 = 3;
        if (combo <= 2)
            upperDifficultyBound = 1;
        if (combo > 2 && combo <= 4)
            upperDifficultyBound = 2;

        const bugFromDB = await db.selectFrom("bugs")
            .where("production", "=", true)
            .where("difficulty", "<=", upperDifficultyBound)
            .leftJoin("served", (eb) =>
                eb.on("served.user_id", "=", user_id).onRef("bugs.id", "=", "served.bug_id")
            )
            .select(["bugs.id as id", "served.id as served_id", "answer", "language", "hint", "body", "explanation"])
            .where("served.id", "is", null) /* not served yet */
            .orderBy(sql`RANDOM()`)
            /* todo: this could be optimized */
            .limit(1)
            .executeTakeFirst();

        const bug = bugFromDB ?? generateBug();
        
        /* mark as served */
        if (bugFromDB) {
            await db.insertInto("served")
                .values({
                    id: undefined,
                    user_id: user_id,
                    bug_id: bug.id,
                    solved: false
                })
                .onConflict((oc) => (oc.columns(["user_id", "bug_id"]).doNothing())) /* ignore duplicate errors on index */
                .execute();
        }

        if (process.env.NODE_ENV === "production") {
            console.log(bug);
        }
        return NextResponse.json(bug, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(generateBug(), {status: 403});
    }
};

export const revalidate = 0;
