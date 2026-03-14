"use client"

import { useRouter } from "next/navigation";
import LoadButton from "./LoadButton";
import { Label, TextInput, Toast } from "flowbite-react";
import { useCallback, useRef, useState } from "react";
import { HiCheck } from 'react-icons/hi';

const PushManager = () => {
    const router = useRouter();

    const [showSentPopup, setShowSentPopup] = useState(false);

    const titleRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLInputElement>(null);

    const sendToAll = useCallback(async () => {
        const title = titleRef.current?.value;
        const body = bodyRef.current?.value;

        if (!title || !body)
            return;

        const data = {
            title,
            body
        };

        const success = await (async () => {
            try {
                const req = await fetch("api/push/all", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
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
        })();

        console.log(success);
        if (success)
            setShowSentPopup(true);
    }, []);

    const sendStreak = useCallback(async () => {
        const success = await (async () => {
            try {
                const req = await fetch("api/push/streak", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
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
        })();

        console.log(success);
        if (success)
            setShowSentPopup(true);
    }, []);

    const popupDismissCallback = useCallback(() => {
        setShowSentPopup(false);
    }, []);

    return (
        <div className="w-full">
            <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg mx-auto max-w-4xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold">Push notifications</h2>
                    </div>
                </div>

                <div className="flex flex-col gap-5 p-10">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="title" value="Title" />
                        </div>
                        <TextInput ref={titleRef} id="title" type="text" defaultValue={""} />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="body" value="Body" />
                        </div>
                        <TextInput ref={bodyRef} id="body" type="text" defaultValue={""} />
                    </div>

                    <div className="flex flex-row justify-center">
                        <LoadButton onClick={sendToAll} text="Send to all" loadingText="Sending..." gradient="pinkToOrange" />
                    </div>
                </div>

                <div className="fixed right-5 top-5">
                    <LoadButton onClick={sendStreak} text="Send streak reminder" loadingText="Sending..." gradient="purpleToBlue" />
                </div>

                <div className="fixed left-5 bottom-5">
                    { 
                        showSentPopup &&
                        <Toast>
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                <HiCheck className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal">Sent!</div>
                            <Toast.Toggle onDismiss={popupDismissCallback}  />
                        </Toast>
                    }
                </div>
            </div>

            <div className="fixed bottom-0 right-0 p-5 flex flex-col gap-2">
                <LoadButton onClick={() => {router.push("/admin")}} text="Bug manager" loadingText="Going there..." />
            </div>
        </div>
    );
}

export default PushManager;
