// lib/generations.ts

import { db } from "./db"
import { getCurrentUser } from "@/lib/session"
import { cache } from "react"
import "server-only"

const PAGE_SIZE = 20

type TGenerationCount = {
  search?: string
}

export const preloadGenerationCount = ({ search }: TGenerationCount) => {
  void getGenerationCount({ search })
}

export const getGenerationCount = cache(async ({ search }: TGenerationCount) => {
  const user = await getCurrentUser()
  if (!user) throw new Error("No user found")

  return db.outputImage.count({
    where: {
      // Relation filter must use `is` for 1:1/1:n
      generation: {
        is: {
          status: "COMPLETE", // use string literal to avoid enum import/version issues
          userId: user.id,
          ...(search
            ? {
                prompt: {
                  contains: search,
                },
              }
            : {}),
        },
      },
    },
  })
})

type TGenerationsForUser = {
  page: number
  search?: string
}

export const preloadGenerations = ({ page, search }: TGenerationsForUser) => {
  void getUserGenerations({ page, search })
}

export const getUserGenerations = cache(
  async ({ page, search }: TGenerationsForUser) => {
    const user = await getCurrentUser()
    if (!user) throw new Error("No user found")

    return db.outputImage.findMany({
      where: {
        generation: {
          is: {
            status: "COMPLETE", // string literal keeps it compatible across Prisma versions
            userId: user.id,
            ...(search
              ? {
                  prompt: {
                    contains: search,
                  },
                }
              : {}),
          },
        },
      },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      include: {
        // Select only what's needed so TS knows `generation.prompt` exists
        generation: {
          select: { prompt: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }
)
