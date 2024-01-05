import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { caseRouter } from "./routers/case";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  case: caseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
