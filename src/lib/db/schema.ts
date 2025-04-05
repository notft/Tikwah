import { 
    pgTable, 
    serial,
    text,
    uuid,
    integer,
    timestamp
} from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const users = pgTable("users", {
    id: serial().primaryKey(),
    username: text().notNull(),
    display_name: text(),
    email: text().notNull(),
    profile: text(),
    password: text(),
    google_access_token: text()
});

export type UsersSelect = InferSelectModel<typeof users>;
export type UsersInsert = InferInsertModel<typeof users>;

export const sessions = pgTable("sessions", {
    id: uuid().defaultRandom().notNull(),
    user_id: integer().references(() => users.id).notNull().unique()
});

export type SessionsSelect = InferSelectModel<typeof sessions>;
export type SessionsInsert = InferInsertModel<typeof sessions>;