import type { RequestHandler } from "./$types";
import { OAuth2RequestError, ArcticFetchError } from "arctic";
import { google } from "$lib/oauth/google";
import { addUser } from "$lib/models/user";
import { createSession } from "$lib/models/sessions";
import { redirect } from "@sveltejs/kit";

export const GET: RequestHandler = async ({url, cookies}) => {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const storedState = cookies.get("state");
    const storedCodeVerifier = cookies.get("code_verifier");

    if (code === null || storedState === null || state !== storedState || storedCodeVerifier === null) {
        // 400
        redirect(301, "/login");
    }

    try{
        const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier!);
        const accessToken = tokens.accessToken(); 
        
        const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const user = await response.json();

        const userId = await addUser({
            email: user.email,
            username: (user.given_name + user.family_name as string).toLowerCase().replaceAll(" ", "_"),
            display_name: user.name,
            profile: user.picture,
            google_access_token: accessToken
        })
        
        const sessionId = await createSession(userId!)!;

        cookies.set("session", sessionId!, {
            secure: false,
            path: "/"
        })
    }catch(e){
        if (e instanceof OAuth2RequestError) {
            // Invalid authorization code, credentials, or redirect URI
            console.log("OAuth Request error:", e.code)
            // ...
        }
        if (e instanceof ArcticFetchError) {
            // Failed to call `fetch()`
            console.log("Arctic Fetch error", e.cause)
            // ...
        }
    
        redirect(301, "/login");
    }
    

    redirect(301, "/dashboard");
}