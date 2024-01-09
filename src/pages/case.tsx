import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { api } from "~/utils/api";
import { type Surgeon } from "~/pages/types/surgeon";
import { type Patient } from "~/pages/types/patient";
import moment from 'moment';

// @ts-expect-error VSCODE bug - unable to remove unused props param
export default function SurgicalCase (_props) {
  const searchParams = useSearchParams();
  const caseId: string | null = searchParams.get("id");
  const caseData = api.case.get.useQuery({ id: Number(caseId) }).data;

  if (!caseData) {
    return <></>;
  }

  const patient: Patient = caseData.patient;
  const surgeon: Surgeon = caseData.surgeon;

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
                    <div className="col-span-2">
                      <p className="text-right">
                        <strong>Name:</strong>
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p>{patient.name}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-right">
                        <strong>Age:</strong>
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p>{patient.age}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-right">
                        <strong>Gender:</strong>
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p>{patient.gender}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-right">
                        <strong>Phone:</strong>
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p>{patient.phone}</p>
                    </div>
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

                    <div className="col-span-2">
                      <p className="text-right">
                        <strong>External ID::</strong>
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p>{caseData.externalId}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-right">
                        <strong>10 Diagnosis Code:</strong>
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p>{caseData.icd10Code}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-right">
                        <strong>Diagnosis:</strong>
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p>{caseData.diagnosis}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-right">
                        <strong>Procedure:</strong>
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p>{caseData.procedure}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-right">
                        <strong>Date of Surgery:</strong>
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p>{moment(caseData.dateOfSurgery).format("MM-DD-YYYY")}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
                  <h3 className="mb-2 rounded-md bg-gray-200 p-2 text-lg font-bold">
                    Surgeon Information
                  </h3>
                  <div className="grid grid-cols-5 gap-2">

                    <div className="col-span-2">
                      <p className="text-right">
                        <strong>Name:</strong>
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p>{surgeon.name}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-right">
                        <strong>NPI:</strong>
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p>{surgeon.npi}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-right">
                        <strong>Specialty:</strong>
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p>{surgeon.specialty}</p>
                    </div>
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
