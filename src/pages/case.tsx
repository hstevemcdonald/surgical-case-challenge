import moment from "moment";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { api } from "~/utils/api";

/** workaround for VSCODE bug? Is adding props plugin? is adding unnecessary props param to default export*/
// @ts-ignore
const Case = (props) => {
  const searchParams = useSearchParams();
  const caseId: string | null = searchParams.get("id");
  const caseData: any = api.case.get.useQuery({ id: Number(caseId) }).data;
  if (!caseData) {
    return <></>;
  }

  const { patient, surgeon } = caseData;

  const patientFields = [
    { key: "name", label: "Name:" },
    { key: "age", label: "Age:" },
    { key: "gender", label: "Gender:" },
    { key: "phone", label: "Phone:" },
  ];
  const caseFields = [
    { key: "externalId", label: "External ID:" },
    { key: "icd10Code", label: "10 Diagnosis Code:" },
    { key: "diagnosis", label: "Diagnosis:" },
    { key: "procedure", label: "Procedure:" },
    { key: "dateOfSurgery", label: "Date of Surgery:" },
  ];
  const surgeonFields = [
    { key: "name", label: "Name:" },
    { key: "npi", label: "NPI:" },
    { key: "specialty", label: "Specialty: " },
  ];

  const handleBack = () => {
    window.location.href = "/";
  };

  return (
    <>
      <Head>
        <title>Surgical Case Data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="border-b border-gray-400 bg-gray-200 p-4">
        <h1 className="text-center text-2xl font-bold">
          Surgical Case ID: #{caseData.externalId}
        </h1>
      </header>

      {patient && (
        <div className="min-h-screen bg-gray-100">
          <div className="container mx-auto max-w-4xl p-4">
            <div className="flex flex-col md:flex-row">
              <div className="p-4 md:w-2/5">
                <img
                  src={patient.photoUrl}
                  alt="Image"
                  className="m-2 w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={handleBack}
                  className="ml-2 rounded-md bg-blue-400 px-4 py-2 font-bold text-white hover:bg-gray-500"
                >
                  &lsaquo; Back
                </button>
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
                              "MM/DD/YYYY",
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

export default Case;