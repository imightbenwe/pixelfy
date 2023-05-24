import { sendMail } from "@/emails"
import LoginLink from "@/emails/LoginLink"
import WelcomeEmail from "@/emails/WelcomeEmail"
import { sendMarketingMail } from "@/emails/index"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextApiRequest } from "next"
import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"

const googleClientId = process.env.GOOGLE_CLIENT_ID as string
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string

export const authOptionsWithEvents = (req: NextApiRequest, res) => {
    return {
        ...authOptions,
        events: {
            async signIn(message) {
                if (message.isNewUser) {
                    const email = message.user.email
                    const name = message.user.name

                    const isReferred =
                        req && req?.cookies && req?.cookies["referralCode"]

                    if (isReferred) {
                        const referredByUser = req.cookies["referralCode"]

                        await db.$transaction([
                            db.user.update({
                                where: {
                                    id: referredByUser,
                                },
                                data: {
                                    credits: {
                                        increment: 1,
                                    },
                                    creditsEarnedViaReferrals: {
                                        increment: 1,
                                    },
                                },
                            }),
                            db.user.update({
                                where: {
                                    email,
                                },
                                data: {
                                    referredByUser: {
                                        connect: {
                                            id: referredByUser,
                                        },
                                    },
                                },
                            }),
                        ])
                    }

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
        providers: [
            GoogleProvider({
                clientId: googleClientId,
                clientSecret: googleClientSecret,
            }),
            EmailProvider({
                sendVerificationRequest: async ({
                    identifier,
                    url,
                    provider,
                }) => {
                    await sendMail({
                        subject: "Your Pixelfy.ai Login Link",
                        to: identifier,
                        component: <LoginLink url={url} />,
                    })
                },
            }),
        ],
        callbacks: {
            async session({ token, session }) {
                if (token) {
                    session.user.id = token.id
                    session.user.name = token.name
                    session.user.email = token.email
                    session.user.image = token.picture
                    session.user.credits = token.credits
                }

                return session
            },
            async jwt({ token, user }) {
                const dbUser = await db.user.findFirst({
                    where: {
                        email: token.email,
                    },
                })

                if (!dbUser) {
                    if (user) {
                        token.id = user?.id
                    }
                    return token
                }

                return {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    picture: dbUser.image,
                    credits: dbUser.credits,
                }
            },
        },
    }
}

// @see ./lib/auth
export default (req: NextApiRequest, res) =>
    NextAuth(req, res, authOptionsWithEvents(req, res))

// export default NextAuth(authOptionsWithEvents)
