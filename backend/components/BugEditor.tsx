"use client"

import type { Bug } from "@/lib/db";
import { Button, Label, Select, TextInput, Textarea, Toast } from "flowbite-react";
import { useCallback, useRef, useState } from "react";
import { HiCheck } from 'react-icons/hi';
import LoadButton from "./LoadButton";

const sendEditedToAPI = async (bug_edit: Partial<Bug>) => {
    try {
        const req = await fetch("api/bugs/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bug_edit)
        });
        
        const res = await req.json();

        if (res.success)
            return true;

        console.error(res)
        return false;
    }
    catch (error) {
        console.error(error);
        return false;
    }
};

type BugEditorProps = {
    editedBug: Bug
    closeCallback: () => void
};

const BugEditor = (props: BugEditorProps) => {
    const languageRef = useRef<HTMLSelectElement>(null);
    const difficultyRef = useRef<HTMLSelectElement>(null);
    const hintRef = useRef<HTMLInputElement>(null);
    const answerRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);
    const explanationRef = useRef<HTMLTextAreaElement>(null);
    const productionRef = useRef<HTMLSelectElement>(null);

    const [showSavedPopup, setShowSavedPopup] = useState(false);

    const saveEditedBug = useCallback(async () => {
        const language = languageRef.current?.value;
        const difficulty = difficultyRef.current?.value;
        const hint = hintRef.current?.value;
        const answer = answerRef.current?.value;
        const body = bodyRef.current?.value;
        const explanation = explanationRef.current?.value;
        const production = productionRef.current?.value;

        if (!language || !difficulty || !hint || !answer || !body || !explanation || production == null) {
            console.log("Invalid edited bug, not saving");
            return;
        }

        const bug_edit: Partial<Bug> = {
            id: props.editedBug.id,

            language: language as Bug["language"],
            difficulty: parseInt(difficulty) as Bug["difficulty"],
            hint: hint,
            answer: parseInt(answer),
            body: body,
            explanation: explanation,
            production: parseInt(production) ? true : false
        };

        const success = await sendEditedToAPI(bug_edit);
        
        if (success)
            setShowSavedPopup(true);
    }, [props.editedBug]);

    const popupDismissCallback = useCallback(() => {
        setShowSavedPopup(false);
    }, []);

    return (
        <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg mx-auto max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold">Bug ID: {props.editedBug.id}</h2>
                </div>
                <div className="flex flex-row gap-5">
                    <Button pill outline gradientDuoTone="pinkToOrange" onClick={props.closeCallback}>Close</Button>
                </div>
            </div>

            <div className="flex flex-col gap-5 p-10">
                <div className="max-w-md">
                    <div className="mb-2 block">
                        <Label htmlFor="language" value="Language" />
                    </div>
                    <Select ref={languageRef} id="language" defaultValue={props.editedBug.language}>
                        <option value={"javascript"}>JavaScript</option>
                        <option value={"typescript"}>TypeScript</option>
                        <option value={"cpp"}>C++</option>
                        <option value={"c"}>C</option>
                        <option value={"ocaml"}>OCaml</option>
                        <option value={"java"}>Java</option>
                    </Select>
                </div>

                <div className="max-w-md">
                    <div className="mb-2 block">
                        <Label htmlFor="difficulty" value="Difficulty" />
                    </div>
                    <Select ref={difficultyRef} id="difficulty" defaultValue={props.editedBug.difficulty}>
                        <option value={1}>easy</option>
                        <option value={2}>medium</option>
                        <option value={3}>hard</option>
                    </Select>
                </div>

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="hint" value="Hint" />
                    </div>
                    <TextInput ref={hintRef} id="hint" type="text" defaultValue={props.editedBug.hint} />
                </div>

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="answer" value="Answer (line of code)" />
                    </div>
                    <TextInput ref={answerRef} id="answer" type="number" defaultValue={props.editedBug.answer} />
                </div>

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="body" value="Body" />
                    </div>
                    <Textarea ref={bodyRef} id="body" defaultValue={props.editedBug.body} rows={4} />
                </div>

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="explanation" value="Explanation" />
                    </div>
                    <Textarea ref={explanationRef} id="explanation" defaultValue={props.editedBug.explanation} rows={1} />
                </div>

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="production" value="Production" />
                    </div>

                    <Select ref={productionRef} id="production" defaultValue={Number(props.editedBug.production)}>
                        <option value={0}>false</option>
                        <option value={1}>true</option>
                    </Select>
                </div>

                <div className="flex flex-row justify-center">
                    <LoadButton onClick={saveEditedBug} text="Save" loadingText="Saving..." gradient="pinkToOrange" />
                </div>
            </div>

            <div className="fixed left-5 bottom-5">
                { 
                    showSavedPopup &&
                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                            <HiCheck className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">Saved.</div>
                        <Toast.Toggle onDismiss={popupDismissCallback}  />
                    </Toast>
                }
            </div>
        </div>
    )
};

export default BugEditor;
