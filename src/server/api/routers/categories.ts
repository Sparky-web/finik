import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export default createTRPCRouter({
    get: protectedProcedure.query(async ({ ctx }) => {
        const categories = await ctx.db.$queryRaw`select c."id", c."type", c."name", c.icon, c.color  from "Category" c 
        left join "Transaction" t on t."categoryId" = c.id and t."userId" = 'cm48opvly0002g6p4exc1g89b'
        group by c."name", c."id" 
        order by  count(t.id) desc`

        return categories
    })
})