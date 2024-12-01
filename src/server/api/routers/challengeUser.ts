import { Prisma } from "@prisma/client";
import { initScriptLoader } from "next/script";
import { INPUT_VALIDATION_RULES } from "node_modules/react-hook-form/dist/constants";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import getUserChallanges from "./_lib/get-user-challanges";

export const challengeUserRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ userId: z.string(), challengeId: z.number(), status: z.enum(["NEW", "IN_PROGRESS", "FAILED", "COMPLETED"]), startDate: z.string().datetime(), endDate: z.string().datetime() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userChallenge.create({
        data: {
          userId: input.userId,
          challengeId: input.challengeId,
          status: input.status,
          startDate: input.startDate,
          endDate: input.endDate

        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.challenge.delete({
        where: {
          id: input.id
        }
      });
    }),


  getbyId: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const challenge = await ctx.db.userChallenge.findUnique({
      where: { id: input },
    });
    return challenge ?? null;
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return getUserChallanges(ctx);
  }),
  takeChallenge: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.userChallenge.create({
        data: {
          userId: ctx.session.user.id,
          challengeId: input.id,
          status: "IN_PROGRESS",
          startDate: new Date().toISOString(),
          endDate: null
        }
      })
    }),
  restartChallenge: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.userChallenge.update({
        where: {
          id: input.id
        },
        data: {
          status: "IN_PROGRESS",
          startDate: new Date().toISOString(),
        }
      })
    }),
});


