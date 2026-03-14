"use client"

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label, TextInput } from 'flowbite-react';
import { useCallback, useRef } from "react";

import LoadButton from "@/components/LoadButton";

export default function SignIn() {
    const router = useRouter();

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const signInCallback = useCallback(async () => {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (!username || !password) {
            console.log("Form error")
            return;
        }

        await signIn("credentials", { username: username, password: password, redirect: false});
        router.push("/admin");
    }, [router]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg mx-auto max-w-4xl w-full">
                <div className="flex flex-col gap-5 p-10">
                    <input name="csrfToken" type="hidden" />
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="username" value="Username" />
                        </div>
                        <TextInput ref={usernameRef} id="username" type="text" required />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password" value="Password" />
                        </div>
                        <TextInput ref={passwordRef} id="password" type="password" required />
                    </div>
                    
                    <div className="flex flex-row justify-center">
                        {/* <Button onClick={signInCallback} outline gradientDuoTone="purpleToBlue" className="w-auto" type="submit">Sign in</Button> */}
                        <LoadButton onClick={signInCallback} text="Sign in" loadingText="Loading..." gradient="purpleToBlue" />
                    </div>
                </div>
            </div>
        </main>
    )
}
