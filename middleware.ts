import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server"

export default withAuth(
    async function middleware(req: NextRequest) {
        const token = await getToken({ req })
        const isAuth = !!token
        const isAuthPage =
            req.nextUrl.pathname.startsWith("/login") ||
            req.nextUrl.pathname.startsWith("/register")

        const response = NextResponse.next()

        const isReferralCodeInSearchParams = req.nextUrl.searchParams.has("ref")

        if (isAuthPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL("/dashboard", req.url))
            }

            if (
                isReferralCodeInSearchParams &&
                !!req.nextUrl.searchParams.get("ref")
            ) {
                response.cookies.set({
                    name: "referralCode",
                    value: req.nextUrl.searchParams.get("ref") as string,
                    path: "/",
                })

                return response
            }

            return null
        }

        if (!isAuth) {
            let from = req.nextUrl.pathname
            if (req.nextUrl.search) {
                from += req.nextUrl.search
            }

            return NextResponse.redirect(
                new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
            )
        }
    },
    {
        callbacks: {
            async authorized() {
                // This is a work-around for handling redirect on auth pages.
                // We return true here so that the middleware function above
                // is always called.
                return true
            },
        },
    }
)

export const config = {
    matcher: ["/dashboard/:path*", "/editor/:path*", "/login", "/register"],
}
