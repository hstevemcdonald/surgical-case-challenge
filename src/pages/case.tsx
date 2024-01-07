import moment from "moment";
import Head from "next/head";
import { useSearchParams } from "next/navigation";

import { api } from "~/utils/api";

export default function Case(props) {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("id");
  const caseData: any = api.case.get.useQuery({ id: Number(caseId) }).data;
  if (!caseData) {
    return <></>;
  }

  const { patient, surgeon } = caseData;

  console.log(caseData);
  const patientFields = [
    { key: "name", label: "Name:" },
    { key: "externalId", label: "External ID:" },
    { key: "age", label: "Age:" },
    { key: "gender", label: "Gender:" },
    { key: "phone", label: "Phone:" },
  ];
  const caseFields = [
    { key: "diagnosis", label: "Diagnosis:" },
    { key: "dateOfSurgery", label: "Date/Time of Surgery:" },
    { key: "procedure", label: "Procedure:" },
    { key: "icd10Code", label: "10 Diagnosis Code:" },
  ];
  const surgeonFields = [
    { key: "name", label: "Name:" },
    { key: "npi", label: "NPI:" },
    { key: "specialty", label: "Specialty: " },
  ];
  return (
    <>
      <Head>
        <title>Surgical Case Data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {patient && (
       <div className="bg-gray-100 min-h-screen">
          <div className="container mx-auto max-w-4xl p-4">
            <header className="flex items-center justify-center w-full p-2 rounded-md bg-gray-200">
            <h3 className="font-bold giv">Surgical Case Data: {patient.name}</h3>
            </header>
            <div className="flex flex-col md:flex-row">
              <div className="p-4 md:w-2/5">
                <img
                  src={patient.photoUrl}
                  alt="Image"
                  className="m-2 w-full rounded-lg object-cover"
                />
              </div>              
              <div className="p-4 md:w-3/5">
           
                <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
                  <h3 className="mb-2 rounded-md bg-gray-200 p-2 text-lg font-bold">
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {patientFields.map((field: any) => {
                      const c1 = (
                        <div className="col-span-2">
                          <p className="text-right">
                            <strong>{field.label}</strong>
                          </p>
                        </div>
                      );
                      const c2 = (
                        <div className="col-span-3">
                          <p>{patient[field.key]}</p>
                        </div>
                      );
                      return [c1, c2];
                    })}
                    <div className="col-span-2">
                      <p className="text-right">
                        <strong>Address:</strong>
                      </p>
                    </div>
                    <div className="col-span-3">
                      {patient.street}
                      <br />
                      {patient.city}
                      <br />
                      {patient.state}
                      <br />
                      {patient.zip}
                    </div>
                  </div>
                </div>
                <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
                  <h3 className="mb-2 rounded-md bg-gray-200 p-2 text-lg font-bold">
                    Case Information
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {caseFields.map((field: any) => {
                      const c1 = (
                        <div className="col-span-2">
                          <p className="text-right">
                            <strong>{field.label}</strong>
                          </p>
                        </div>
                      );
                      const c2Value =
                        field.key === "dateOfSurgery"
                          ? moment(caseData[field.key]).format(
                              "MM/DD/YYYY HH:MM",
                            )
                          : caseData[field.key];
                      const c2 = (
                        <div className="col-span-3">
                          <p>{c2Value}</p>
                        </div>
                      );
                      return [c1, c2];
                    })}
                  </div>
                </div>
                <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
                  <h3 className="mb-2 rounded-md bg-gray-200 p-2 text-lg font-bold">
                    Surgeon Information
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {surgeonFields.map((field: any) => {
                      const c1 = (
                        <div className="col-span-2">
                          <p className="text-right">
                            <strong>{field.label}</strong>
                          </p>
                        </div>
                      );
                      const c2 = (
                        <div className="col-span-3">
                          <p>{surgeon[field.key]}</p>
                        </div>
                      );
                      return [c1, c2];
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
       </div>
      )}
    </>
  );
}
