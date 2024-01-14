import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext } from 'react';

type UserValues = "streak" | "combo";

export class User {
    logged_in: boolean

    streak?: number
    combo?: number

    constructor() {
        this.logged_in = false;
    }

    async _getValueFromLocalStorage(key: UserValues): Promise<number> {
        const value = await AsyncStorage.getItem(key);
            
        if (!value) {
            return 0;
        }
        return parseInt(value);
    }

    async incrementStreak(): Promise<void> {
        if (!this.logged_in) {
            this.streak = await this._getValueFromLocalStorage("streak");

            await AsyncStorage.setItem("streak", (this.streak + 1).toString());
        }
        else {
            /* call API */
        }
    }

    async incrementCombo(): Promise<void> {
        if (!this.logged_in) {
            this.combo = await this._getValueFromLocalStorage("combo");

            await AsyncStorage.setItem("combo", (this.combo + 1).toString());
        }
        else {
            /* call API */
        }
    }

    async resetCombo(): Promise<void> {
        if (!this.logged_in) {
            await AsyncStorage.setItem("combo", (0).toString());
        }
        else {
            /* call API */
        }
    }

    async getUpdated(): Promise<User> {
        const new_user = new User();

        new_user.combo = await this._getValueFromLocalStorage("combo");
        new_user.streak = await this._getValueFromLocalStorage("streak");

        return new_user;
    }
}

export const UserContext = createContext<{user: User, setUser: React.Dispatch<React.SetStateAction<User>>}>({
    user: null,
    setUser: () => {}
});
