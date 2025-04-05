import type {Actions, PageServerLoad} from "./$types";
import { google } from "$lib/oauth/google";
import { generateState, generateCodeVerifier } from "arctic";
import { redirect } from "@sveltejs/kit";

import { login } from "$lib/models/sessions";

export const load: PageServerLoad = async ({params, cookies}) => {

    if(cookies.get("session")){
        redirect(302, "/dashboard");
    }

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const scopes = ["email", "profile", "openid"];
    const url = google.createAuthorizationURL(state, codeVerifier, scopes);

    cookies.set("state", state, {
        secure: false,
        path: "/",
        httpOnly: true
    });

    cookies.set("code_verifier", codeVerifier, {
        secure: false,
        path: "/",
        httpOnly: true
    });

    return {
        authUrl: url.toString()
    }
}

export const actions: Actions = {
    login: async ({request, cookies}) => {
        const body = await request.formData()

        const email = body.get("email") as string;
        const password = body.get("password") as string;

        try {
            const sessionId = await login(email, password);
            cookies.set("session", sessionId!, {
                secure: false,
                path: "/"
            })

            redirect(302, "/dashboard");
        } catch (error) {
            console.error(error);
        }
    }
};