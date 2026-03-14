"use client"

import { useRouter } from "next/navigation";

import type { Bug } from "@/lib/db";
import BugRow from "./BugRow";
import LoadButton from "./LoadButton";

type BugsTableProps = {
    bugs: Bug[]
    loadDuration: number
    openEditor: (bug: Bug) => void
    addBugCallback: () => void
    deleteBugCallback: (bug: Bug) => Promise<any>
};

const BugTable = (props: BugsTableProps) => {
    const router = useRouter();

    return (
        <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg mx-auto max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold">All Bugs</h2>
                    <p className="text-sm text-gray-500">
                        Fetched {props.bugs.length} entries in {props.loadDuration}ms
                    </p>
                </div>
                <div className="flex flex-row gap-5">
                    <LoadButton onClick={props.addBugCallback} text="New" loadingText="Adding..." gradient="pinkToOrange" />
                    <LoadButton onClick={router.refresh} text="Refresh" loadingText="Refreshing..." gradient="purpleToBlue" />
                </div>
            </div>
            <div className="divide-y divide-gray-900/5">
                {props.bugs.map((bug) => (
                    <BugRow key={bug.id} bug={bug} openEditor={props.openEditor} deleteBug={props.deleteBugCallback} />
                ))}
            </div>
        </div>
    );
};

export default BugTable;
