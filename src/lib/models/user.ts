import { db } from "$lib/db";
import { users, type UsersInsert } from "$lib/db/schema";
import { eq } from "drizzle-orm";

export async function addUser(user: UsersInsert){
    const existingUsers = await db.select().from(users).where(eq(users.email, user.email));

    if(existingUsers.length > 0){
        return (await db.update(users).set(user).where(eq(users.email, user.email)).returning()).at(0)?.id;
    }else{
        return (await db.insert(users).values(user).returning()).at(0)?.id;
    }
}