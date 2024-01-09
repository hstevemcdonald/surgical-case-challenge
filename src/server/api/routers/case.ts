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
  put: publicProcedure
    .input(z.object({ diagnosis: z.string(), convertedDateOfSurgery: z.string(), procedure: z.string(), icd10Code: z.string(), surgeonId: z.number(), patientId: z.number(), externalId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.db.surgicalCase.create({
        data: {
          externalId: input.externalId,
          patientId: input.patientId,
          surgeonId: input.surgeonId,
          diagnosis: input.diagnosis,
          procedure: input.procedure,
          icd10Code: input.icd10Code,
          dateOfSurgery: new Date(input.convertedDateOfSurgery)
        }
      })
    }),
  first: publicProcedure.query(({ ctx }) => {
    return ctx.db.surgicalCase.findFirst();
  }),
});
