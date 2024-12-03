import { Prisma } from "@prisma/client";
import { INPUT_VALIDATION_RULES } from "node_modules/react-hook-form/dist/constants";
import { z } from "zod";
import axios from 'axios';

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

  getDNK: protectedProcedure.query(async ({ ctx }) => {
    const trans = await ctx.db.transaction.findMany({
      orderBy: { date: "desc" },
      where: { User: { id: ctx.session.user.id} },
      include: {
        category: true // не прикрутил название категорий
      }
    })

    const url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";

    const {data} = await axios.post(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'RqUID': '<уникальный_идетификатор_запроса>', // надо генерить uuid4
        'Authorization': 'NzlmNDI0YWYtYjVkOS00NmNlLThjZjMtNTUzOTc3NDczOTM5OmVmNTExODQ2LWNjMTYtNGExYy04M2NkLWU2ZGIxZmE5NjUzMg=='

      }
    })

    const access_token = data.access_token;

    const {data1} = await axios.post(url, {
        "model": "GigaChat",
        "messages": [
        {
          "role": "user",
          "content": `${trans} \n проанализируй траты пользователя по параметрам: Импульсивность, Рациональность, Планирование, оцени в процентах от 1 до 100 и кратко опиши почему такой процент (максимум 100 символов для каждого параметра)`
        }
        ],
        "stream": false,
        "repetition_penalty": 1
        }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`

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

      const firstdate = moment().startOf('month').toISOString();
      const lastdate=moment().endOf('month').toISOString();


      const firstmonth =moment().subtract(1, 'months').startOf('month').toISOString()
      const lastmonth=moment().subtract(1, 'months').endOf('month').toISOString()


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
      }) ?? 0
      console.log(`----------------- ${transin._sum.amount}----------------------`);
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
      }) ?? 0
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
      }) ?? 0
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
      }) ?? 0

      var sumin1: any = transin._sum.amount ?? null;
      var sumin2: any = transin1._sum.amount ?? null;
      var sumout1: any = transout._sum.amount ?? null;
      var sumout2: any = transout1._sum.amount ?? null;
      var aboba1: any = 0;
      var aboba2: any = 0;

      if (sumin1 > sumin2){
        if(sumin2 == null){
          aboba1 = null
        }
        else{
          aboba1 = (sumin1/sumin2)*100
        }
      }
      else if(sumin1 < sumin2){
        if(sumin1 == null){
          aboba1 = null
        }
        else{
          aboba1 = (sumin2/sumin1)*100
        }
      }
      else if(sumin1 == sumin2){
        aboba1 = 0;
      }

      if (sumout1 > sumout2){
        if(sumout2 == null || sumout1 == null){
          aboba2 = null
        }
        else{
          aboba2 = (sumout1/sumout2)*100
        }
      }
      else if(sumout1 < sumout2){
        if(sumout1 == null || sumout1 == null){
          aboba2 = 0
        }
        else{
          aboba2 = (sumout2/sumout1)*100
        }
      }
      else if(sumout1 == sumout2){
        aboba2 = 0;
      }


    return [{
      balance: user?.balance,
      saving: user?.savings,
      in: transin._sum.amount,
      out: transout._sum.amount,
      inPercent: aboba1,
      outPercent: aboba2



    }];
      }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
