// app/sitemap.ts
// Minimal, DB-free sitemap to stop prerender errors.
// (No database calls, no external fetch — safe for Vercel build.)

import type { MetadataRoute } from "next"

function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000"
  return raw.startsWith("http") ? raw : `https://${raw}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl()
  const now = new Date()

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/examples`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/dashboard`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/tos`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]
}
