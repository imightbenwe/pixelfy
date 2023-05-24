"use client"

import { useTheme } from "next-themes"
import Head from "next/head"
import Script from "next/script"

type TStripePricingTable = {
    clientReferenceId: string
}
export const StripePricingTable = ({
    clientReferenceId,
}: TStripePricingTable) => {
    const { theme } = useTheme()

    console.log("clientReferenceId", clientReferenceId)

    return (
        <>
            <Script
                async
                src="https://js.stripe.com/v3/pricing-table.js"
            ></Script>

            {/* @ts-ignore */}
            <stripe-pricing-table
                client-reference-id={clientReferenceId}
                pricing-table-id="prctbl_1N245hK3wHFLqQwQkevsKkLz"
                publishable-key="pk_test_51N214gK3wHFLqQwQMJL9zicI2nOeSiKs3IdD1LOZhOqgRc7PaeGykfkR8asDAQVMxI4Dyno13kK3bl8oJDymLejP0099fOEQ5X"
            />
        </>
    )
}
