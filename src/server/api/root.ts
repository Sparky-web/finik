import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { transRouter } from "./routers/trans";
import { userRouter } from "./routers/user";
import { challengeRouter } from "./routers/challenge";
import { challengeUserRouter } from "./routers/challengeUser";
import categoryRouter from "./routers/categories";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  transaction: transRouter,
  category: categoryRouter,
  user: userRouter,
  challenge: challengeRouter,
  challengeUser: challengeUserRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
