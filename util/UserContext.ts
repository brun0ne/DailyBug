import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ContextType, createContext } from 'react';

import AppConfig from '../util/AppConfig';

export const UserContext = createContext<{
    user: FirebaseAuthTypes.User
    updated: boolean
    setUpdated: React.Dispatch<React.SetStateAction<boolean>>
    progressData: UserProgressData
}>({
    user: null,
    updated: true,
    progressData: null,
    setUpdated: () => {}
});

type UserContextValue = ContextType<typeof UserContext>;

export type UserProgressData = {
    streak: number
    combo: number

    level: number
    exp: number
    maxExp: number

    currency: number
}

export class UserAPI {
    private static async doRequest(user: FirebaseAuthTypes.User, endpoint: string, method: string, reqData: any) {
        const idToken = await user.getIdToken(true);

        const headers = {
            idToken: idToken
        };

        try {
            const req = await fetch(AppConfig.api(endpoint), {
                method: method,
                headers: headers,
                ...(method === "POST" ? { body: JSON.stringify(reqData) } : {})
            });
            const res = await req.json();
            
            return res;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    static async getProgress(context: UserContextValue) {
        const data = await UserAPI.doRequest(context.user, "user/progress", "GET", {});
        return data as UserProgressData;
    }

    static async bugDone(context: UserContextValue, correct: boolean) {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const data = await UserAPI.doRequest(context.user, "user/done", "POST", {
            /* this is used to calculate a new Streak value */
            timezone: timezone,
            correct: correct
        });
        context.setUpdated(true);

        return data;
    }

    static async correct(context: UserContextValue) {
        return await UserAPI.bugDone(context, true) as {reward: {type: 'exp' | 'currency' | 'none', value: number}};
    }

    static async wrong(context: UserContextValue) {
        await UserAPI.bugDone(context, false);
    }

    static async doSprint(context: UserContextValue) {
        const res = await UserAPI.doRequest(context.user, "special/sprint", "POST", {});

        context.setUpdated(true);
        return res;
    }

    static async init(user: FirebaseAuthTypes.User) {
        const res = await UserAPI.doRequest(user, "user/init", "POST", {});
        console.log("INIT", res);
    }

    static async getBug(user: FirebaseAuthTypes.User) {
        return await UserAPI.doRequest(user, "bugs/request", "GET", {});
    }
};

