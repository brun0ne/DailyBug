import {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable
} from 'kysely';

import { Kysely } from 'kysely';
import { LibsqlDialect } from "@libsql/kysely-libsql";

export interface Database {
    bugs: BugTable
    users: UserTable
    served: ServedTable
    items: ItemsTable
};

export const Languages = ["javascript", "typescript", "cpp", "c", "ocaml", "java"] as const;

export interface BugTable {
    id: Generated<number>

    language: typeof Languages[number]
    difficulty: 1 | 2 | 3
    hint: string
    answer: number
    body: string
    explanation: string

    production: Generated<boolean>

    created_at: ColumnType<string, string | undefined, never>
};

export interface UserTable {
    id: Generated<number>
    uid: String

    streak: Generated<number>
    combo: Generated<number>

    level: Generated<number>
    exp: Generated<number>
    currency: Generated<number>

    pity4: Generated<number>
    pity5: Generated<number>
    sprints: Generated<number>

    push_token: Generated<string>

    last_streak_time: ColumnType<string, string | undefined, string | undefined>
    created_at: ColumnType<string, string | undefined, never>
};

export interface ServedTable {
    id: Generated<number>

    user_id: number
    bug_id: number

    solved: boolean
};

export interface ItemsTable {
    id: Generated<number>

    user_id: number
    items: string
};

export type Bug = Selectable<BugTable>;
export type NewBug = Insertable<BugTable>;
export type UpdateBug = Updateable<BugTable>;

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdateUser = Updateable<UserTable>;

export type Served = Selectable<ServedTable>;
export type NewServed = Insertable<ServedTable>;
export type UpdateServed = Updateable<ServedTable>;

export type Items = Selectable<ItemsTable>;
export type NewItem = Insertable<ItemsTable>;
export type UpdateItem = Insertable<ItemsTable>;

export { sql } from 'kysely';

export const db = new Kysely<Database>({
    dialect: new LibsqlDialect({
        url: process.env.DB_URL,
        authToken: process.env.DB_TOKEN,
    }),
});
