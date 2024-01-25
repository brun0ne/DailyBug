import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ContextType, createContext } from 'react';

import AppConfig from '../util/AppConfig';

export const UserContext = createContext<{user: FirebaseAuthTypes.User, updated: boolean, setUpdated: React.Dispatch<React.SetStateAction<boolean>>}>({
    user: null,
    updated: true,
    setUpdated: () => {}
});

type UserContextValue = ContextType<typeof UserContext>;

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

    static async getStreak(context: UserContextValue) {
        const data = await UserAPI.doRequest(context.user, "user/streak", "GET", {});
        return data.streak as number;
    }

    static async getCombo(context: UserContextValue) {
        const data = await UserAPI.doRequest(context.user, "user/combo", "GET", {});
        return data.combo as number;
    }

    static async incrementCombo(context: UserContextValue) {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const combo = await UserAPI.getCombo(context);

        await UserAPI.doRequest(context.user, "user/combo", "POST", {
            combo: combo + 1,
            /* this is used to calculate a new Streak value */
            timezone: timezone
        });
        context.setUpdated(true);
    }

    static async resetCombo(context: UserContextValue) {
        await UserAPI.doRequest(context.user, "user/combo", "POST", {
            combo: 0
        });
        context.setUpdated(true);
    }

    static async init(user: FirebaseAuthTypes.User) {
        const res = await UserAPI.doRequest(user, "user/init", "POST", {});
        console.log("INIT", res);
    }

    static async getBug(user: FirebaseAuthTypes.User) {
        return await UserAPI.doRequest(user, "bugs/request", "GET", {});
    }
};

