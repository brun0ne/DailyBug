import { Suspense } from "react";
import { Spinner } from "flowbite-react";
import BugManager from "@/components/BugManager";

import { db } from "@/lib/db";
import { NextAuthProvider } from "@/app/providers";

const getBugs = async () => {
    try {
        return await db.selectFrom("bugs").selectAll().execute();
    }
    catch (e: any) {
        console.log("Table 'bugs' does not exist.");
        return [];
    }
};

const getUserCount = async () => {
    const get = async () => (await db.selectFrom("users").select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirstOrThrow()).count;

    try {
        return await get();
    }
    catch (e: any) {
        console.log("Table 'users' does not exist.");
        return 0;
    }
}

const getServedCount = async () => {
    const get = async () => (await db.selectFrom("served").select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirstOrThrow()).count;

    try {
        return await get();
    }
    catch (e: any) {
        console.log("Table 'served' does not exist.");
        return 0;
    }
}

export default async function BugLoader() {
    const startTime = Date.now();
    const bugs = await getBugs();
    const duration = Date.now() - startTime;

    const userCount = await getUserCount();
    const servedCount = await getServedCount();

    return (
        <Suspense fallback={<Spinner />}>
            <NextAuthProvider>
                <BugManager bugs={JSON.parse(JSON.stringify(bugs))} userCount={userCount} loadDuration={duration} servedCount={servedCount} />
            </NextAuthProvider>
        </Suspense>
    )
};
