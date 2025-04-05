import {createHash, pbkdf2} from "node:crypto";
import {SALT} from "$env/static/private";

export async function generateHash(input: string): Promise<string>{
    return new Promise((resolve, reject) => {
        const hash = createHash("sha512");

        hash.on("readable", () => {
            const data = hash.read()

            if(data){
                resolve(data.toString("hex"));
            }
        })

        hash.write(SALT+input);
        hash.end();
    })
}

export async function generatePasswordHash(password: string): Promise<string>{
    return new Promise((resolve, reject) => {
        pbkdf2(password, SALT, 100000, 64, "sha512", (err, derivedKey) => {
            if(err) reject(err);
            resolve(derivedKey.toString('hex'))
        })
    })
}