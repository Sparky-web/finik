import { Prisma } from "@prisma/client";
import { INPUT_VALIDATION_RULES } from "node_modules/react-hook-form/dist/constants";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// const moment = require('moment');

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string(), emailVerifed: z.string().datetime(), image: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          emailVerified: input.emailVerifed,
          image: input.image,
          password: "lmao"
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.delete({
        where: {
          id: input.id
        }
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findMany();

    return user ?? null;
  }),

  getbyId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: input },
    });
    return user ?? null;
  }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });




    return post ?? null;
  }),

  getIn: protectedProcedure.query(async ({ ctx }) => {
    const trans = await ctx.db.transaction.findMany({
      orderBy: { date: "desc" },
      where: { User: { id: ctx.session.user.id}, type: "IN" },
      include: {
        category: true
      }
    })

    return trans ?? null;
  }),

    getOut: protectedProcedure.query(async ({ ctx }) => {
        const trans = await ctx.db.transaction.findMany({
          orderBy: { date: "desc" },
          where: { User: { id: ctx.session.user.id}, type: "OUT" },
          include: {
            category: true
          }
    })

    return trans ?? null;
  }),

  getSumm: protectedProcedure.query(async ({ ctx }) => {
    const trans = await ctx.db.transaction.groupBy({
      where: {
        User: {
          id: ctx.session.user.id
        },
      },
      _sum: {
        amount: true
      },
      orderBy: undefined,
      by: ["type", "categoryId"]

    })

    return trans ?? null;
  }),

    addMoney: protectedProcedure
    .input(z.object({ money: z.number()}))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id : ctx.session.user.id
        },
        data: {
          balance: {
            increment: input.money
          }
            
        },
      });
    }),

    addMoneySaving: protectedProcedure
    .input(z.object({ money: z.number()}))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id : ctx.session.user.id
        },
        data: {
          savings: {
            increment: input.money
          }
            
        },
      });
    }),

    removeMoney: protectedProcedure
    .input(z.object({ money: z.number()}))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id : ctx.session.user.id
        },
        data: {
          balance: {
            decrement: input.money
          }
            
        },
      });
    }),

    removeMoneySaving: protectedProcedure
    .input(z.object({ money: z.number()}))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id : ctx.session.user.id
        },
        data: {
          savings: {
            decrement: input.money
          }
            
        },
      });
    }),

    getMonth: protectedProcedure.query(async ({ ctx }) => {

      const firstdate = moment().startOf('month').format('DD-MM-YYYY');
      const lastdate=moment().endOf('month').format("DD-MM-YYYY");
      
      const trans = await ctx.db.transaction.groupBy({
        where: {
            User: {
                id: ctx.session.user.id
            },
            date: {
              gte: firstdate,
              lte: lastdate,
            }
        },
       _sum: {
               amount: true
            },
            orderBy: undefined,
            by: ["type"]
      
    })

    return trans ?? null;
      }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
