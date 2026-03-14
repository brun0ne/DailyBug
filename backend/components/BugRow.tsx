"use client"
import { memo, useCallback, useEffect, useState, useTransition } from "react";

import type { Bug } from "@/lib/db";
import IconButton from "./IconButton";
import { Spinner } from "flowbite-react";

const DeleteBugButton = ({callback}: {callback: () => void}) => {
    const [isPending, startTransition] = useTransition();

    const transitionCallback = useCallback(() => {
        startTransition(callback)
    }, [callback]);

    return (
        !isPending ?
        (
            <IconButton onHoverColor={"red"} onClick={transitionCallback}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /> 
            </IconButton>
        ) :
        (
            <Spinner />
        )
    )
};

type BugRowButtonsProps = {
    openEditorCallback: () => void
    deleteBugCallback: () => void
}

const BugRowButtons = (props: BugRowButtonsProps) => {
    return (
        <div className="flex items-center space-x-4">
            <IconButton onHoverColor="green" onClick={props.openEditorCallback}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </IconButton>

            <DeleteBugButton callback={props.deleteBugCallback} />
        </div>
    );
};

type BugRowProps = {
    bug: Bug
    openEditor: (bug: Bug) => void
    deleteBug: (bug: Bug) => Promise<any>
};

const BugRow = ({bug, openEditor, deleteBug}: BugRowProps) => {
    const MAX_LENGTH = 50;
    const BUTTONS_HIDE_TIMEOUT_MS = 500;

    const [isHovered, setIsHovered] = useState(false);
    const [displayButtons, setDisplayButtons] = useState(false);

    const shorten = useCallback((text: string) => (
        `${text.length < MAX_LENGTH ?
            text :
            text.substring(0, MAX_LENGTH - 3) + "..."
        }`
    ), []);

    const onMouseEnterCallback = useCallback(() => {
        setIsHovered(true);
    }, []);
    const onMouseLeaveCallback = useCallback(() => {
        setIsHovered(false);
    }, []);

    const openEditorCallback = useCallback(() => {
        openEditor(bug);
    }, [openEditor, bug]);

    const deleteBugCallback = useCallback(async () => {
        await deleteBug(bug);
    }, [deleteBug, bug]);

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;

        if (isHovered) {
            setDisplayButtons(true);
        }
        else {
            timeout = setTimeout(() => {
                setDisplayButtons(false);
            }, BUTTONS_HIDE_TIMEOUT_MS);
        }

        return () => {
            timeout && clearTimeout(timeout);
        }
    }, [isHovered]);

    return (
        <div
            className="flex items-center justify-between py-4"
            onMouseEnter={onMouseEnterCallback}
            onMouseLeave={onMouseLeaveCallback}
        >
            <div className="flex items-center space-x-4">
                <div className="space-y-1">
                    <p className="font-medium leading-none">{shorten(bug.hint)}</p>
                    <p className="text-sm text-gray-500">{shorten(bug.body)}</p>
                </div>
            </div>
            {
                displayButtons ?
                    <BugRowButtons openEditorCallback={openEditorCallback} deleteBugCallback={deleteBugCallback} /> :
                    <p className="text-sm text-gray-500" suppressHydrationWarning>{bug.created_at.toLocaleString()} </p>
            }
        </div>
    );
};

export default memo(BugRow);
