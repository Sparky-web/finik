import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const transRouter = createTRPCRouter({
    create: publicProcedure
    .input(z.object({ type: z.enum(["IN", "OUT"]), categoryId: z.number(), amount: z.number(), userId: z.string() }))
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
      console.log(ctx.session.user.id);
      const post = await ctx.db.transaction.findFirst({
        orderBy: { date: "desc" },
        where: { User: { id: ctx.session.user.id } },
      });
  
      return post ?? null;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
