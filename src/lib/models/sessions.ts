import { db } from "$lib/db";
import { sessions, users } from "$lib/db/schema";
import { and, eq } from "drizzle-orm";
import { generatePasswordHash } from "$lib/security";

export async function createSession(userId: number){
    const existingSession = await db.select().from(sessions).where(eq(sessions.user_id, userId));

    if(existingSession.length > 0){
        return existingSession.at(0)?.id
    }else{
        return (await db.insert(sessions).values({
            user_id: userId
        }).returning()).at(0)?.id;
    }
}

export async function getSessionUser(sessionId: string){
    const existingSession = await db.select().from(sessions).where(eq(sessions.id, sessionId));

    if(existingSession.length === 0){
        throw Error("No such session found");
    }

    const user = (await db.select().from(users).where(eq(users.id, existingSession.at(0)?.user_id!))).at(0)
    return user;
}

export async function login(email: string, password: string){
    const passwordHash = await generatePasswordHash(password);

    const user = await db.select().from(users).where(and(eq(users.email, email), eq(users.password, passwordHash)))

    if(user.length > 0){
        const session = createSession(user.at(0)?.id!);
        return session;
    }else{
        console.error("No user found: " + email)
        throw Error("No user found");
    }
}