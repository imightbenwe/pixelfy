import { sendMail } from "@/emails"
import LoginLink from "@/emails/LoginLink"
import WelcomeEmail from "@/emails/WelcomeEmail"
import { sendMarketingMail } from "@/emails/index"
import { authOptions } from "@/lib/auth"
import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"

const googleClientId = process.env.GOOGLE_CLIENT_ID as string
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string

let authOptionsWithEvents = {
    ...authOptions,
    events: {
        async signIn(message) {
            if (message.isNewUser) {
                const email = message.user.email
                const name = message.user.name

                if (email) {
                    await Promise.all([
                        sendMarketingMail({
                            subject: "🎨 Welcome to Pixelfy",
                            to: email,
                            component: (
                                <WelcomeEmail name={name ?? undefined} />
                            ),
                        }),
                    ])
                }
            }
        },
    },
}

authOptionsWithEvents.providers = [
    GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
    }),
    EmailProvider({
        sendVerificationRequest: async ({ identifier, url, provider }) => {
            await sendMail({
                subject: "Your Pixelfy.ai Login Link",
                to: identifier,
                component: <LoginLink url={url} />,
            })
        },
    }),
]
// @see ./lib/auth
export default NextAuth(authOptionsWithEvents)
