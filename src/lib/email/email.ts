// // import nodemailer from "nodemailer";
// // import { EMAIL_USER, EMAIL_REFRESH_TOKEN, EMAIL_ACCESS_TOKEN, EMAIL_CLIENT_ID, EMAIL_CLIENT_SECRET } from "$env/static/private";

// const transport = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         type: "OAUTH2",
//         user: EMAIL_USER,
//         clientId: EMAIL_CLIENT_ID,
//         clientSecret: EMAIL_CLIENT_SECRET,
//         refreshToken: EMAIL_REFRESH_TOKEN,
//         accessToken: EMAIL_ACCESS_TOKEN
//     }
// })

// export async function sendMail(to: string[], subject: string, html: string){
//     const info = await transport.sendMail({
//         from: `Sakura Hosting <${EMAIL_USER}>`,
//         to: to.reduce((previous, current) => `${previous}, ${current}`),
//         subject: subject,
//         html: html
//     })

//     return info;
// }