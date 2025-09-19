// lib/generations.ts

import { db } from "./db"
import { getCurrentUser } from "@/lib/session"
import { cache } from "react"
import "server-only"
import { GenerationStatus } from "@prisma/client"

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
      // Filter through the related Generation using a relation filter
      generation: {
        is: {
          status: GenerationStatus.COMPLETE,
          userId: user.id, // or: user: { is: { id: user.id } }
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
            status: GenerationStatus.COMPLETE,
            userId: user.id, // or: user: { is: { id: user.id } }
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
        // Only bring what the page needs so TS has `generation.prompt`
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
