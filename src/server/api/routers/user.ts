import { Prisma } from "@prisma/client";
import { INPUT_VALIDATION_RULES } from "node_modules/react-hook-form/dist/constants";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import moment from 'moment';

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

    setMoneySaving: protectedProcedure
    .input(z.object({ money: z.number()}))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id : ctx.session.user.id
        },
        data: {
          savings: input.money
            
        },
      });
    }),

    setMoney: protectedProcedure
    .input(z.object({ money: z.number()}))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id : ctx.session.user.id
        },
        data: {
          balance: input.money
            
        },
      });
    }),



    getMonth: protectedProcedure.query(async ({ ctx }) => {

      const firstdate = moment().startOf('month').format('DD-MM-YYYY');
      const lastdate=moment().endOf('month').format("DD-MM-YYYY");
      const firstmonth =moment().subtract(1, 'months').startOf('month').format('DD-MM-YYYY');
      const lastmonth=moment().subtract(1, 'months').endOf('month').format('DD-MM-YYYY')



      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id
        }
      })

  

      
      const transin = await ctx.db.transaction.aggregate({
        where: {
          User: {
            id: ctx.session.user.id,
          },
          type: "IN",
          date: {
            gte: firstdate,
            lte: lastdate,
          }
        },
        _sum: {
          amount: true
        },
      })
      const transout = await ctx.db.transaction.aggregate({
        where: {
          User: {
            id: ctx.session.user.id,
          },
          type: "OUT",
          date: {
            gte: firstdate,
            lte: lastdate,
          }
        },
        _sum: {
          amount: true
        },
      })
      const transin1 = await ctx.db.transaction.aggregate({
        where: {
          User: {
            id: ctx.session.user.id,
          },
          type: "IN",
          date: {
            gte: firstmonth,
            lte: lastmonth,
          }
        },
        _sum: {
          amount: true
        },
      })
      const transout1 = await ctx.db.transaction.aggregate({
        where: {
          User: {
            id: ctx.session.user.id,
          },
          type: "OUT",
          date: {
            gte: firstmonth,
            lte: lastmonth,
          }
        },
        _sum: {
          amount: true
        },
      })

      var sumin1: any =  transin._sum;
      var sumin2: any = transin1._sum;
      var sumout1: any = transout._sum;
      var sumout2: any = transout1._sum;
      var aboba1 = 0;
      var aboba2 = 0;

      if (transin._sum > transin1._sum){
        aboba1 = (sumin1/sumin2)*100
      }
      else if(transin._sum <= transin1._sum){
        aboba1 = (sumin2/sumin1)*100
      }
      else if(transin._sum == transin1._sum){
        aboba1 = 0;
      }

      if (transout._sum > transout1._sum){
        aboba2 = (sumin1/sumin2)*100
      }
      else if(transout._sum <= transout1._sum){
        aboba2 = (sumin2/sumin1)*100
      }
      else if(transout._sum == transout1._sum){
        aboba2 = 0;
      }


    return [{
      balance: user?.balance,
      saving: user?.savings,
      in: transin._sum,
      out: transout._sum,
      inPercent: aboba1,
      outPercent: aboba2



    }];
      }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
