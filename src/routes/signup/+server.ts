import type { RequestHandler } from "./$types";
import { generateHash, generatePasswordHash } from "$lib/security";
import { addUser } from "$lib/models/user";

export const POST: RequestHandler = async ({request, cookies}) => {
    const body: {
        email: string,
        username: string,
        otp: string,
        password: string
    } = await request.json();

    const email = body.email;
    const userName = body.username;
    const otp = body.otp;
    const password = body.password;

    const otpHash = await generateHash(otp);
    const storedHash = cookies.get("otp");

    if(otpHash === storedHash){
        await addUser({
            email,
            password: await generatePasswordHash(password),
            username: userName
        })

        return new Response();    
    }

    return new Response(null, {
        status: 400
    });
}