import { buildSendMail } from "mailing-core"
import nodemailer from "nodemailer"

export const sendMail = buildSendMail({
    transport: nodemailer.createTransport({
        host: "smtp.postmarkapp.com",
        port: 587,
        secure: true,
        auth: {
            user: process.env.POSTMARK_API_KEY,
            pass: process.env.POSTMARK_API_KEY,
        },
    }),
    defaultFrom: "David from Pixelfy <pixelfy@pixelfy.ai>",
    configPath: "./mailing.config.json",
})

export default sendMail

export const sendMarketingMail = buildSendMail({
    transport: nodemailer.createTransport({
        host: "smtp-broadcasts.postmarkapp.com",
        port: 587,
        auth: {
            user: process.env.POSTMARK_MARKETING_API_KEY,
            pass: process.env.POSTMARK_MARKETING_API_SECRET,
        },
    }),
    defaultFrom: "David from Pixelfy <pixelfy@pixelfy.ai>",
    configPath: "./mailing.config.json",
})
