import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getSummary } from "./_lib/get-summary";
import { getGroupedTransactions } from "./_lib/get-transactions";
import { off } from "process";
import pmap from 'p-map';

const checkChallange = async (ctx: any, categoryId: number) => {
  const userChallanges = await ctx.db.userChallenge.findMany({
    where: {
      userId: ctx.session.user.id,
      challenge: {
        categoryId
      },
      status: "IN_PROGRESS"
    },
    include: {
      challenge: true
    }
  })


  console.log(userChallanges)
  if (userChallanges.length > 0) {
    await ctx.db.userChallenge.update({
      where: {
        id: userChallanges[0].id
      },
      data: {
        status: "FAILED"
      }
    })
  }
}

export const transRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ type: z.enum(["IN", "OUT"]), categoryId: z.number(), amount: z.number(), userId: z.string(), commentary: z.string().optional(), date: z.string().datetime() }))
    .mutation(async ({ ctx, input }) => {

      if (input.type == "IN") {
        const user = await ctx.db.user.update({
          where: {
            id: input.userId
          },
          data: {
            balance: {
              increment: input.amount
            }
          }
        })
      }
      else if (input.type == "OUT") {
        const user = await ctx.db.user.update({
          where: {
            id: input.userId
          },
          data: {
            balance: {
              decrement: input.amount
            }
          }
        })
      }

      if (input.type === "OUT") {
        checkChallange(ctx, input.categoryId)
      }

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

  import: protectedProcedure.input(z.array(z.object({
    date: z.date(),
    amount: z.number(),
    type: z.enum(["IN", "OUT"]),
    category: z.string(),
    commentary: z.string().optional()
  }))).mutation(async ({ ctx, input }) => {
    let errors = 0;
    let imported = 0;

    const categories = await ctx.db.category.findMany()

    for (const item of input) {
      let category = categories.find(c => c.name === item.category && c.type === item.type)
      if (!category) {
        category = await ctx.db.category.create({
          data: {
            name: item.category,
            type: item.type,
            color: "#808080",
          },
        });
        categories.push(category)
      }

      item.categoryId = category?.id
    }

    const foundTransactions = await ctx.db.transaction.findMany({
      where: {
        date: {
          in: input.map(i => i.date)
        },
        userId: ctx.session.user.id
      }
    })

    const newTransactions = input.filter(i => !foundTransactions.find(t => t.date.toISOString() === i.date.toISOString()))

    const res = await ctx.db.transaction.createMany({
      data: newTransactions.map(i => ({
        date: i.date,
        type: i.type,
        categoryId: i.categoryId,
        amount: i.amount,
        userId: ctx.session.user.id,
        commentary: i.commentary || ''
      }))
    })

    // await pmap(input, async (item) => {
    //   try {
    //     if(foundTransactions.find(t => t.date.toISOString() === item.date.toISOString())) return;

    //     const transaction = await ctx.db.transaction.create({
    //       data: {
    //         date: item.date,
    //         type: item.type,
    //         categoryId: item.categoryId,
    //         amount: item.amount,
    //         userId: ctx.session.user.id,
    //         commentary: item.commentary || ''
    //       },
    //     });

    //     imported++;
    //   } catch (e) {
    //     console.error(e);
    //     errors++;
    //   }
    // }, { concurrency: 5 });


    return {
      imported: res.count,
      // errors
    }
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

      if (!transaction || transaction.userId !== ctx.session.user.id) throw new Error('Недостаточно прав для изменения транзакции')

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
