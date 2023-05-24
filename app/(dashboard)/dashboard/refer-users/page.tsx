import { CopyLinkButton } from "@/components/copy-link-button"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { Stats } from "@/components/stats"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Refer users",
    description:
        "Copy your referral link and accumulate credits for referring active users",
}

export default async function ReferUsersPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined }
}) {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const userWithReferrals = await db.user.findUnique({
        where: {
            id: user.id,
        },
        include: {
            _count: {
                select: {
                    usersReferred: true,
                },
            },
        },
    })

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Refer users"
                text="Refer your friends, earn credits. It's that simple."
            ></DashboardHeader>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Referral link</CardTitle>
                        <CardDescription>
                            Share this referral link with your friends to earn
                            credits. You'll earn credits for every user that you
                            refer who signs up and becomes an active user.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <Input
                                type="text"
                                value={`https://www.pixelfy.ai/register?ref=${user.id}`}
                                readOnly
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <CopyLinkButton
                            url={`https://www.pixelfy.ai/register?ref=${user.id}`}
                        >
                            Copy referral link
                        </CopyLinkButton>
                    </CardFooter>
                </Card>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4">
                <h3 className="font-heading text-xl md:text-2xl">
                    Your referral stats
                </h3>
                <Stats
                    stats={[
                        {
                            name: "Users referred",
                            value:
                                userWithReferrals?._count?.usersReferred ?? 0,
                        },
                        {
                            name: "Credits earned",
                            value:
                                userWithReferrals?.creditsEarnedViaReferrals ??
                                0,
                        },
                    ]}
                />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 mb-24">
                <h3 className="font-heading text-xl md:text-2xl">
                    Referral FAQ
                </h3>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            How many credits do I earn if a user signs up using
                            my link?
                        </AccordionTrigger>
                        <AccordionContent>
                            You can earn one credit for every user that signs
                            up. There is no limit to the amount of users you can
                            refer or credits you can earn from referrals.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>
                            How many credits do I earn if a user I referred
                            makes a purchase?
                        </AccordionTrigger>
                        <AccordionContent>
                            If you refer a user and they make a credit purchase,
                            you will receive 10 additional credits to your
                            credit balance. This only applies to the referred
                            users first purchase. Any subsequent purchases from
                            a referred user will not trigger a bonus.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>
                            A user signed up with my link but I didn't earn any
                            credits, what happened?
                        </AccordionTrigger>
                        <AccordionContent>
                            If you believe there has been an issue with credit
                            attribution please reach out to support at
                            pixelfy@pixelfy.ai.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </DashboardShell>
    )
}
