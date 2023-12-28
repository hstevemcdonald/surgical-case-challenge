import { PrismaClient } from "@prisma/client";
import sourceData from "../data/cases.json";

const prisma = new PrismaClient();

async function seed() {
  console.log("\n===> Seeding data...");

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "User",
    },
  });
  console.log(`Created user: ${user.email}`);

  /**
   * NOTE: The seed script will error out with connection timeout issues if using Promise.all.
   * To workaround this, append `?connection_limit=1` to the connection string.
   * see: https://github.com/prisma/prisma/issues/9562#issuecomment-1242491767
   */
  const surgeons = await Promise.all(
    sourceData.surgeons.map((surgeon) =>
      prisma.surgeon.upsert({
        where: { npi: surgeon.npi },
        update: {},
        create: {
          npi: surgeon.npi,
          name: surgeon.name,
          specialty: surgeon.specialty,
        },
      }),
    ),
  );
  console.log(`Created ${surgeons.length} surgeons`);

  const patients = await Promise.all(
    sourceData.patient_records.map((patient) =>
      prisma.patient.upsert({
        where: { externalId: patient.patient_id },
        update: {},
        create: {
          externalId: patient.patient_id,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          photoUrl: patient.photo,
          phone: patient.phone,
          street: patient.address.street_address,
          city: patient.address.city,
          state: patient.address.state,
          zip: patient.address.zip_code,
        },
      }),
    ),
  );
  console.log(`Created ${patients.length} patients`);

  const surgicalCases = await Promise.all(
    sourceData.surgical_cases.map((surgicalCase) =>
      prisma.surgicalCase.upsert({
        where: { externalId: String(surgicalCase.case_id) },
        update: {},
        create: {
          externalId: String(surgicalCase.case_id),
          patientId: patients.find(
            (p) => p.externalId === surgicalCase.patient_id,
          )!.id,
          surgeonId: surgeons.find((s) => s.npi === surgicalCase.surgeon_npi)!
            .id,
          dateOfSurgery: new Date(surgicalCase.date_of_surgery),
          diagnosis: surgicalCase.diagnosis,
          procedure: surgicalCase.procedure,
          icd10Code: surgicalCase["ICD-10_diagnosis_code"],
        },
      }),
    ),
  );
  console.log(`Created ${surgicalCases.length} surgical cases`);

  console.log("===> Done!\n");
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
