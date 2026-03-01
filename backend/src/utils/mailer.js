// import nodemailer from 'nodemailer';

// export const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth : {
//         user: process.env.EMAIL,
//         pass : process.env.EMAIL_PASS
//     }
// })

//ye upar vala galat hai or niche vale dono shi hai
//bs arrow function vale me uska ek instanse bnana pdega agr use use kr rhe ho tho


import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

// import nodemailer from "nodemailer";

// export const createTransporter = () => {
//     return nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL,
//             pass: process.env.EMAIL_PASS
//         }
//     });
// };

// isme humne transporter ko arrow function me isliye convert kiya q ke
// bina arrow function ke createtransport phle call ho jata hai
//or dotenv se email credentials load nahi hote the isliye error aata tha
// ab jab bhi transporter call karenge toh wo function execute hoga aur tabhi email credentials load honge