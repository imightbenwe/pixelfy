// app/sitemap.ts
// Minimal, DB-free sitemap compatible with Next.js MetadataRoute.Sitemap
// (Only url + lastModified are allowed here.)

import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl()
  const now = new Date()

  return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/examples`, lastModified: now },
    { url: `${base}/dashboard`, lastModified: now },
    { url: `${base}/tos`, lastModified: now },
    { url: `${base}/privacy-policy`, lastModified: now },
  ]
}

function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000"
  return raw.startsWith("http") ? raw : `https://${raw}`
}
