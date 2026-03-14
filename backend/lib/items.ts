import { Entries } from 'type-fest';

import { db } from "@/lib/db";
import DateDiff from 'date-diff';

type DuckProps = {
    level: number
    last_fed: string
};

/**** */

type SetItemProps = {
    color: string
    icon: string
    stars: number

    hiddenIfNotOwned?: boolean
    maxOne?: boolean
};

export type SavedItemProps = {
    amount: number
    active?: boolean

    special?: null | DuckProps
};

type Item = SetItemProps & SavedItemProps;

type AllItemNames = "Skip" | "Saver" | "Cookie" | "Rubber Duck";
export type AllItemsType = Record<AllItemNames, Item>;

export const AllItems: Record<AllItemNames, Omit<SetItemProps, "amount">> = {
    "Skip": {
        color: "#2563eb",
        icon: "skip-next-circle-outline",
        stars: 4
    },
    "Saver": {
        color: "#e11d48",
        icon: "fire",
        stars: 4
    },
    "Cookie": {
        color: "#facc15",
        icon: "cookie",
        stars: 3
    },
    "Rubber Duck": {
        color: "#d6c52d",
        icon: "duck",
        stars: 5,
        hiddenIfNotOwned: true,
        maxOne: true
    }
};

const getOwnedItems = (loadedItemProps: Record<string, SavedItemProps>) => {
    let ownedItems = AllItems as AllItemsType;

    for (const [name, _] of Object.entries(AllItems) as Entries<typeof AllItems>) {
        ownedItems[name].amount = loadedItemProps[name]?.amount ?? 0;
        ownedItems[name].active = loadedItemProps[name]?.active ?? false;
        ownedItems[name].special = loadedItemProps[name]?.special ?? null;
    }

    return ownedItems;
};

const loadOwnedItems = async (user_id: number) => {
    const itemsRes = await db.selectFrom("items")
        .select("items")
        .where("user_id", "=", user_id)
        .executeTakeFirst();
    
    const loadedItemProps: Record<string, SavedItemProps> = itemsRes ? JSON.parse(itemsRes.items) : {};
    const ownedItems = getOwnedItems(loadedItemProps);

    return ownedItems;
};

const saveOwnedItems = async (user_id: number, items: AllItemsType) => {
    let itemPropsToSave: Record<string, SavedItemProps> = {};

    for (const [name, item] of Object.entries(items) as Entries<typeof items>) {
        itemPropsToSave[name] = {
            amount: item.amount,
            active: item.active,
            
            special: item.special
        };
    }

    await db.insertInto("items")
        .values({user_id: user_id, items: JSON.stringify(itemPropsToSave)})
        .onConflict((oc) =>
            oc.column("user_id")
                .doUpdateSet({items: JSON.stringify(itemPropsToSave)})
        )
        .execute();
}

export { loadOwnedItems, saveOwnedItems };

/**** */

export const canFeedDuck = async (user_id: number, items: AllItemsType) => {
    /* grab datetimes */
    const now = new Date();

    /* increment Streak if date difference == 1 day */
    const lastFedDate = new Date(
        Date.parse(items["Rubber Duck"].special?.last_fed ?? (new Date(1900, 1, 1).toISOString()))
    );

    const diffDays = Math.floor(new DateDiff(
        new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        new Date(lastFedDate?.getFullYear() ?? 1900, lastFedDate?.getMonth() ?? 1, lastFedDate?.getDate() ?? 1),
    ).days());

    if (items.Cookie.amount <= 0 || items["Rubber Duck"].amount <= 0 || diffDays <= 0 || (items["Rubber Duck"].special?.level ?? 1) >= 10) {
        return false;
    }

    return true;
}
