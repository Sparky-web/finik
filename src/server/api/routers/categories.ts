import { createTRPCRouter, publicProcedure } from "../trpc";

export default createTRPCRouter({
    get: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.category.findMany();
    })
})