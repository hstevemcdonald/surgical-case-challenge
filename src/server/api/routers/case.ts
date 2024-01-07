import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const caseRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.surgicalCase.findMany({
      include: {
        patient: true,
        surgeon: true
      }
    });
  }),

  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.db.surgicalCase.findUnique({
        where: { id: input.id },
        include: {
          patient: true,
          surgeon: true
        }
      });
    }),

  first: publicProcedure.query(({ ctx }) => {
    return ctx.db.surgicalCase.findFirst();
  }),
});
