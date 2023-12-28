import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
      });
    }),

  first: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findFirst();
  }),
});
