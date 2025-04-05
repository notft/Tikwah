import type { RequestHandler } from "./$types";
import { sendMail } from "$lib/email/email";
import Otp from "$lib/components/otp.svelte";
import { render } from "svelte/server"
import { json } from "@sveltejs/kit";
import { generateHash } from "$lib/security";

function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

export const GET: RequestHandler = async ({cookies, url}) => {
    const searchParams = url.searchParams;
    const otp = searchParams.get("otp");

    if(!otp){
        return json({
            verified: false
        })
    }

    const otpHash = await generateHash(otp);
    const cookieHash = cookies.get("otp");

    if(otpHash === cookieHash){
        return json({
            verified: true
        })
    }else{
        return json({
            verified: false
        })
    }
}

export const POST: RequestHandler = async ({request, cookies}) => {
    const body: {email: string, otp: string} = await request.json();
    const email = body.email;
    const otp = getRandomInt(100000, 999999).toString();

    const otpHash = await generateHash(otp);
    cookies.set("otp", otpHash, {
        path: "/"
    })

    const info = await sendMail([email], "Checking if it's really you.", (render(Otp, {
        props: {
            otp
        }
    })).body)

    return json({
        info
    });
}