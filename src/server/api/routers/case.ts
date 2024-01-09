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
    .mutation(({ input, ctx }) => {

      console.log("PUT", input, ctx);
      // return ctx.db.surgicalCase.create({
      //   data: {
      //     externalId: input.externalId,
      //   }
      // })
    }),
  first: publicProcedure.query(({ ctx }) => {
    return ctx.db.surgicalCase.findFirst();
  }),
});
// .input(z.object({ externalId: z.string() }))
// id            Int      @id @default(autoincrement())
//     externalId    String   @unique
//     patientId     Int
//     patient       Patient  @relation(fields: [patientId], references: [id])
//     surgeonId     Int
//     surgeon       Surgeon  @relation(fields: [surgeonId], references: [id])
//     dateOfSurgery DateTime
//     diagnosis     String
//     procedure     String
//     icd10Code     String
//     createdAt     DateTime @default(now())
//     updatedAt     DateTime @updatedAt

// create: publicProcedure
//   .input(z.object({ patient_id: z.string(), diagnosis: z.string(), date_of_surgery: z.date(), procedure: z.string(), ICD-10_diagnosis_code: z.string(), surgeon_npi: z.string() }))
//   .mutations(({ input, ctx }) => {
//     return ctx.db.surgicalCase.create({

//     });
//   }),
// .input(z.object({ patient_id: z.string(), diagnosis: z.string(), date_of_surgery: z.date(), procedure: z.string(), ICD-10_diagnosis_code: z.string(), surgeon_npi: z.string() }))
