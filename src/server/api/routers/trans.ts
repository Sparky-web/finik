import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getSummary } from "./_lib/get-summary";
import { getGroupedTransactions } from "./_lib/get-transactions";
import { off } from "process";

export const transRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ type: z.enum(["IN", "OUT"]), categoryId: z.number(), commentary: z.string().optional(), amount: z.number(), userId: z.string(), commentary: z.string().optional(), date: z.string().datetime() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction.create({
        data: {
          date: input.date,
          type: input.type,
          categoryId: input.categoryId,
          amount: input.amount,
          userId: input.userId,
          commentary: input.commentary || ''
        },
      });
    }),


  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction.delete({
        where: {
          id: input.id
        }
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
  get: protectedProcedure
    .input(z.object({
      dbeg: z.date(),
      dend: z.date(),
      limit: z.number().optional().default(100),
      offset: z.number().optional().default(0),
    })).query(async ({ ctx, input }) => {

      const { summary } = await getSummary(input.dbeg, input.dend, ctx.session.user.id);
      const { transactions } = await getGroupedTransactions(input.dbeg, input.dend, input.limit, input.offset, ctx.session.user.id);

      return {
        summary,
        transactions,
      };
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), date: z.string().datetime(), amount: z.number(), categoryId: z.number(), notes: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.db.transaction.findFirst({
        where: {
          id: input.id
        }
      })

      if(!transaction || transaction.userId !== ctx.session.user.id) throw new Error('Недостаточно прав для изменения транзакции')

      return ctx.db.transaction.update({
        where: {
          id: input.id
        },
        data: {
          date: input.date,
          amount: input.amount,
          categoryId: input.categoryId,
          commentary: input.notes,
        }
      });
    }),
});
