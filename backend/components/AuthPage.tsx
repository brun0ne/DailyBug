"use client"

import { signIn } from "next-auth/react";
import { useCallback } from "react";
import LoadButton from "./LoadButton";
import { useRouter } from "next/navigation";

const AuthPage = () => {
    const router = useRouter();

    const onClickCallback = useCallback(async () => {
        await signIn(undefined, {redirect: false});
        router.push("/signin");
    }, [router]);

    return (
        <LoadButton onClick={onClickCallback} text="Sign in" loadingText="Loading..." gradient="purpleToBlue" />
    )
};

export default AuthPage;
