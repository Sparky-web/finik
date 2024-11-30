import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const transRouter = createTRPCRouter({
    create: publicProcedure
    .input(z.object({ type1: z.string(), categoryId: z.number(), amount: z.number(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction.create({
        data: {
          type: input.type,
          categoryId: input.categoryId,
          amount: input.amount,
          userId: input.userId
        },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return post ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
