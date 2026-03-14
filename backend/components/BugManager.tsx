"use client"

import { useCallback, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import type { Bug } from "@/lib/db";
import { Languages } from "@/lib/languages";

import BugTable from "./BugTable";
import BugEditor from "./BugEditor";
import LoadButton from "./LoadButton";

type BugManagerProps = {
    bugs: Bug[]
    loadDuration: number

    userCount: number
    servedCount: number
}

const BugManager = (props: BugManagerProps) => {
    const [editedBug, setEditedBug] = useState<Bug | null>(null);
    const router = useRouter();

    const openEditor = useCallback((bug: Bug) => {
        setEditedBug(bug);
    }, []);
    const closeEditor = useCallback(() => {
        setEditedBug(null);
        router.refresh();
    }, [router]);

    const addBugCallback = useCallback(async () => {
        const req = await fetch("/api/bugs/new", {
            method: "POST"
        });
        const insertedBug: Bug = (await req.json()).bug;
        setEditedBug(insertedBug);
    }, []);

    const deleteBugCallback = useCallback(async (bug: Bug) => {
        const data = {
            id: bug.id
        };

        const req = await fetch("/api/bugs/delete", {
            method: "POST",
            body: JSON.stringify(data)
        });
        await req.json(); /* Wait for response */

        /* Reload */
        router.refresh();
    }, [router]);

    const signOutCallback = useCallback((async () => {
        await signOut({redirect: false});
        router.refresh();
    }), [router]);

    const stats = useMemo(() => {
        const getDiffCount = (difficulty: typeof props.bugs[number]["difficulty"]) =>
            props.bugs.filter((bug) => bug.difficulty === difficulty).length;

        type LangType = typeof Languages[number];

        const getLangCount = (language: LangType) =>
            props.bugs.filter((bug) => bug.language === language).length;

        const languageCounts: Partial<Record<LangType, number>> = {};
        for (const language of Languages) {
            languageCounts[language] = getLangCount(language);
        }

        return {
            easy: getDiffCount(1),
            medium: getDiffCount(2),
            hard: getDiffCount(3),
            languageCounts
        };
    }, [props]);

    return (
        <div className="w-full">
            {
                !!editedBug ? 
                    <BugEditor
                        closeCallback={closeEditor}
                        editedBug={editedBug}
                    /> :
                    <BugTable
                        bugs={props.bugs}
                        loadDuration={props.loadDuration}
                        openEditor={openEditor}
                        addBugCallback={addBugCallback}
                        deleteBugCallback={deleteBugCallback}
                    />
            }

            <div className="fixed top-0 left-0 p-5">
                <LoadButton onClick={signOutCallback} text="Sign out" loadingText="Signing out..." />
            </div>

            <div className="fixed top-0 right-0 p-5 flex flex-col gap-2">
                <LoadButton onClick={() => {}} text={`Users: ${props.userCount.toString()}`} loadingText="..." />
                <LoadButton onClick={() => {}} text={`Served: ${props.servedCount.toString()}`} loadingText="..." />
            </div>

            <div className="fixed bottom-0 left-0 p-5 flex flex-col gap-10">
                <div className="flex flex-col gap-0">
                    <span><b>Stats:</b></span>
                    <span>Easy: {stats.easy}</span>
                    <span>Medium: {stats.medium}</span>
                    <span>Hard: {stats.hard}</span>
                </div>
                
                <div className="flex flex-col gap-0">
                    <span><b>Languages:</b></span>
                    {
                        Object.entries(stats.languageCounts)
                            .sort(([name1, count1], [name2, count2]) => count2 - count1)
                            .map(([language, count]) => (
                                <span key={language}>{language}: {count}</span>
                            ))
                    }
                </div>
            </div>

            <div className="fixed bottom-0 right-0 p-5 flex flex-col gap-2">
                <LoadButton onClick={() => {router.push("/push")}} text="Push manager" loadingText="Going there..." />
            </div>
        </div>
    );
};

export default BugManager;
