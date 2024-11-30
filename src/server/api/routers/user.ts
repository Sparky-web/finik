import { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
    })

    return trans ?? null;
    }),

    getOut: protectedProcedure.query(async ({ ctx }) => {
        const trans = await ctx.db.transaction.findMany({
          orderBy: { date: "desc" },
          where: { User: { id: ctx.session.user.id}, type: "OUT" },
    })
    
    return trans ?? null;
    }),

    getSumm: protectedProcedure.query(async ({ ctx }) => {
        const trans = await ctx.db.transaction.findMany({
            where: {
                User: {
                    id: ctx.session.user.id
                },
            },
            select: {
                _sum: {
                    select: {amount: true},
                },
                orderBy: undefined,
                by: ["type", "categoryId"]
        }   
        })
    
    return trans ?? null;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
