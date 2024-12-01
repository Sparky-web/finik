import { Prisma } from "@prisma/client";
import { initScriptLoader } from "next/script";
import { INPUT_VALIDATION_RULES } from "node_modules/react-hook-form/dist/constants";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const challengeUserRouter = createTRPCRouter({
    create: publicProcedure
    .input(z.object({ userId: z.string(), challengeId: z.number(), status: z.enum(["NEW", "IN_PROGRESS", "FAILED", "COMPLETED"]), startDate:  z.string().datetime(), endDate:  z.string().datetime() }))
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
    .input(z.object({ id: z.number()}))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.challenge.delete({
        where: {
            id: input.id
        }
      });
    }),

    getbyId: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
        const challenge = await ctx.db.challenge.findUnique({
          where: { id: input },
        });
        return challenge ?? null;
      }),

      getAll: protectedProcedure.query(async ({ ctx }) => {
        const challenge= await ctx.db.challenge.findMany();
        return challenge ?? null;

      })


});
