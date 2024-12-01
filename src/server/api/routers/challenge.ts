import { Prisma } from "@prisma/client";
import { initScriptLoader } from "next/script";
import { INPUT_VALIDATION_RULES } from "node_modules/react-hook-form/dist/constants";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const challengeRouter = createTRPCRouter({
    create: publicProcedure
    .input(z.object({ name: z.string(), categoryId: z.number(), durationDays: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.challenge.create({
        data: {
          name: input.name,
          categoryId: input.categoryId,
          durationDays: input.durationDays
            
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
