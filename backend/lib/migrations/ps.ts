// old seed/migration code

import { db, sql } from '@/lib/db';

export async function seedBugs() {
    const createTable = await db.schema
        .createTable('bugs')
        .ifNotExists()
        .addColumn('id', 'serial', (cb) => cb.primaryKey())
        .addColumn('language', 'varchar(255)', (cb) => cb.notNull())
        .addColumn('difficulty', 'integer', (cb) => (
            cb.unsigned().defaultTo(1)
        ))
        .addColumn('production', 'boolean', (cb) => (
            cb.defaultTo(false).notNull()
        ))
        .addColumn('hint', 'text', (cb) => cb.notNull())
        .addColumn('answer', 'integer', (cb) => cb.notNull())
        .addColumn('body', 'text', (cb) => cb.notNull())
        .addColumn('explanation', 'text', (cb) => cb.notNull())
        .addColumn('created_at', 'timestamp', (cb) =>
            cb.defaultTo(sql`CURRENT_TIMESTAMP()`)
        )
        .execute();

    console.log(`Created "bugs" table`);

    const addUsers = await db
        .insertInto('bugs')
        .values([
            {
                language: "javascript",
                hint: "Look for possible XSS 👀",
                answer: 8,
                difficulty: 1,
                body: `
                const render = (props) => {
                    /* unsanitized user input */
                    const { userInput } = props;
        
                    return (
                        <div>
                            <h1>Hello {userInput}!</h1>
                        </div>
                    );
                };
                `,
                explanation: "Inserting unsanitized user input into HTML can lead to XSS!"
            },
            {
                language: "javascript",
                hint: "Where is a math operation being performed?",
                answer: 5,
                difficulty: 1,
                body: `
                /* Add two numbers together */
        
                const add = (a, b) => {
                    return a - b;
                }
                `,
                explanation: "'-' instead of '+'!"
            }
        ])
        .execute();

    console.log('Seeded table "bugs" with 2 Bugs');

    return {
        createTable,
        addUsers,
    };
}

export async function seedUsers() {
    const createTable = await db.schema
        .createTable('users')
        .ifNotExists()
        .addColumn('id', 'serial', (cb) => cb.primaryKey())
        .addColumn('uid', 'varchar(255)', (cb) => cb.unique().notNull())
        .addColumn('streak', 'integer', (cb) => (
            cb.defaultTo(0).unsigned().notNull()
        ))
        .addColumn('combo', 'integer', (cb) => (
            cb.defaultTo(0).unsigned().notNull()
        ))
        .addColumn('level', 'integer', (cb) => (
            cb.defaultTo(1).unsigned().notNull()
        ))
        .addColumn('exp', 'integer', (cb) => (
            cb.defaultTo(0).unsigned().notNull()
        ))
        .addColumn('currency', 'integer', (cb) => (
            cb.defaultTo(200).notNull()
        ))
        .addColumn('pity4', 'integer', (cb) => (
            cb.defaultTo(0).unsigned().notNull()
        ))
        .addColumn('pity5', 'integer', (cb) => (
            cb.defaultTo(0).unsigned().notNull()
        ))
        .addColumn('push_token', 'varchar(255)', (cb) => (
            cb.defaultTo('').notNull()
        ))
        .addColumn('last_streak_time', 'datetime', (cb) =>
            cb.defaultTo('2000-01-01 00:00:01').notNull()
        )
        .addColumn('created_at', 'timestamp', (cb) =>
            cb.defaultTo(sql`CURRENT_TIMESTAMP()`)
        )
        .execute();

    console.log(`Created "users" table`);

    return {
        createTable,
        ...seedItems()
    };
}

export async function seedServed() {
    const createTable = await db.schema
        .createTable('served')
        .ifNotExists()
        .addColumn('id', 'serial', (cb) => cb.primaryKey())
        .addColumn('user_id', 'bigint', (cb) => cb.references('users.id').notNull())
        .addColumn('bug_id', 'bigint', (cb) => cb.references('bugs.id').notNull())
        .addColumn('solved', 'boolean', (cb) => cb.notNull())
        .execute();

    const addUIDIndex = await db.schema
        .createIndex('served_user_id_index')
        .on('served')
        .column('user_id')
        .execute();

    const addUniqueIndex = await db.schema
        .createIndex('served_user_bugs_ids_index')
        .on('served')
        .columns(['user_id', 'bug_id'])
        .unique()
        .execute();
    
    console.log(`Created "served" table`);

    return {
        createTable,
        addUIDIndex,
        addUniqueIndex
    };
}

export async function seedItems() {
    const createTable = await db.schema
        .createTable('items')
        .ifNotExists()
        .addColumn('id', 'serial', (cb) => cb.primaryKey())
        .addColumn('user_id', 'bigint', (cb) => cb.references('users.id').unique().notNull())
        .addColumn('items', 'json', (cb) => cb.notNull())
        .execute();
    
    console.log(`Created "items" table`);
    
    return {
        createItemsTable: createTable
    };
}
