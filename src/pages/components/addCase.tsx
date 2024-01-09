import React, { useState } from "react";
import { api } from "~/utils/api";
import moment from "moment";
import { type Case, type AddCaseModalProps, type AutoCompleteItem } from "~/pages/types/case";

export function AddCaseModal(props: AddCaseModalProps) {
  const clearCaseData: Case = {
    patientId: 0,
    patientName: "",
    externalId: "",
    surgeonId: 0,
    surgeonName: "",
    procedure: "",
    diagnosis: "",
    dateOfSurgery: "",
    convertedDateOfSurgery: "",
    icd10Code: "",
  };

  const showAddCaseModal = props.showAddCaseModal;
  const setShowAddCaseModal = props.setShowAddCaseModal;
  const autoCompleteList = props.autoCompleteList;
  const setCookie = props.setCookie;
  const { patients, surgeons } = autoCompleteList;
  const [caseData, setCaseData] = useState<Case>(clearCaseData);
  const [filteredPatients, setFilteredPatients] = useState<AutoCompleteItem[]>([]);
  const [filteredSurgeons, setFilteredSurgeons] = useState<AutoCompleteItem[]>([]);
  const mutation = api.case.put.useMutation();

  // add case to db
  const handleAddCase = () => {
    delete caseData.surgeonName;
    delete caseData.patientName;
    const newCase: Case = {
      patientId: Number(caseData.patientId),
      surgeonId: Number(caseData.surgeonId),
      diagnosis: caseData.diagnosis,
      procedure: caseData.procedure,
      icd10Code: caseData.icd10Code,
      externalId: caseData.externalId,
      convertedDateOfSurgery: moment(caseData.dateOfSurgery).format(),
    };
    mutation.mutate(newCase);
    // close and reset fields for model
    setShowAddCaseModal(false);
    setCaseData(clearCaseData);
    setCookie('addCaseSuccess', true);
    window.location.href = "/";
  };

  // close modal
  const handleClose = () => {
    setShowAddCaseModal(false);
    setCaseData(clearCaseData);
  };

  // display autocomplete list of matching patients
  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newFilteredPatients: AutoCompleteItem[] = value.length ? patients.filter((patient: AutoCompleteItem) => {
      const stripSearch = value.replace(/[^a-zA-Z0-9]/, "");
      const re = new RegExp(stripSearch, "i");
      return patient.id.toString().match(re) ?? patient.name.match(re);
    })
      : [];
    setCaseData({ ...caseData, patientName: value });
    setFilteredPatients(newFilteredPatients);
  };

  // select patient
  const handleSelectPatient = (e: { name: string, id: number }) => {
    setCaseData({ ...caseData, patientName: e.name, patientId: e.id });
    setFilteredPatients([]);
  };

  // display autocomplete list of matching surgeons
  const handleSurgeonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newFilteredSurgeons: AutoCompleteItem[] = value.length ? surgeons.filter((surgeon: AutoCompleteItem) => {
        const stripSearch = value.replace(/[^a-zA-Z0-9]/, "");
        const re = new RegExp(stripSearch, "i");
        return surgeon.name.match(re);
      })
      : [];
    setCaseData({ ...caseData, surgeonName: value });
    setFilteredSurgeons(newFilteredSurgeons);
  };

  // select Surgeon
  const handleSelectSurgeon = (e: { name: string, id: number }) => {
    setCaseData({ ...caseData, surgeonName: e.name, surgeonId: e.id });
    setFilteredSurgeons([]);
  };

  // handle form fields
  const handleFormFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const fieldName = e.target.id;
    const value = e.target.value;
    setCaseData({ ...caseData, [fieldName]: value });
  };

  return (
    showAddCaseModal && (
      <>
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="max-w-x2 relative mx-auto my-6 w-1/3">
              {/*content*/}
              <div className="border-1 relative flex w-full flex-col rounded-lg bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid p-5">
                  <h4 className="font-semibold">Add Case</h4>
                  <button
                    className="border-1 float-right ml-auto bg-transparent font-semibold leading-none text-black  outline-none focus:outline-none"
                    onClick={handleClose}
                  >
                    <span className="opacity-2 text-black outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>

                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <form className="space-y-3">
                    <div className="mb-6 md:flex md:items-center">
                      <div className="md:w-1/3">
                        <label className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
                          Case ID
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input
                          id="externalId"
                          className="w-full appearance-none rounded border-2 border-gray-200  px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
                          type="text"
                          value={caseData.externalId}
                          onChange={handleFormFieldChange}
                        />
                      </div>
                    </div>
                    <div className="mb-6 md:flex md:items-center">
                      <div className="md:w-1/3">
                        <label className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
                          Patient
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input
                          className="w-full appearance-none rounded border-2 border-gray-200  px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
                          id="patientName"
                          type="text"
                          value={caseData.patientName}
                          onChange={handlePatientChange}
                        />
                        {filteredPatients.length > 0 && (
                          <ul className="absolute z-50 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-md ring-1 ring-black ring-opacity-5">
                            {filteredPatients.map((patient) => (
                              <li
                                key={patient.id + "patient"}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleSelectPatient(patient)}
                              >
                                {patient.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="mb-6 md:flex md:items-center">
                      <div className="md:w-1/3">
                        <label className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
                          10 Diagnosis Code
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input
                          id="icd10Code"
                          className="w-full appearance-none rounded border-2 border-gray-200  px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
                          type="text"
                          value={caseData.icd10Code}
                          onChange={handleFormFieldChange}
                        />
                      </div>
                    </div>
                    <div className="mb-6 md:flex md:items-center">
                      <div className="md:w-1/3">
                        <label className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
                          Diagnosis
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <textarea
                          rows={3}
                          className="w-full appearance-none rounded border-2 border-gray-200  px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
                          id="diagnosis"
                          value={caseData.diagnosis}
                          onChange={handleFormFieldChange}
                        />
                      </div>
                    </div>
                    <div className="mb-6 md:flex md:items-center">
                      <div className="md:w-1/3">
                        <label className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
                          Procedure
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input
                          className="w-full appearance-none rounded border-2 border-gray-200  px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
                          id="procedure"
                          type="text"
                          value={caseData.procedure}
                          onChange={handleFormFieldChange}
                        />
                      </div>
                    </div>

                    <div className="mb-6 md:flex md:items-center">
                      <div className="md:w-1/3">
                        <label className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
                          Surgeon
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input
                          className="w-full appearance-none rounded border-2 border-gray-200  px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
                          id="surgeonName"
                          type="text"
                          value={caseData.surgeonName}
                          onChange={handleSurgeonChange}
                        />
                        {filteredSurgeons.length > 0 && (
                          <ul className="absolute z-50 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-md ring-1 ring-black ring-opacity-5">
                            {filteredSurgeons.map((surgeon) => (
                              <li
                                key={surgeon.id + "surgeon"}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleSelectSurgeon(surgeon)}
                              >
                                {surgeon.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="mb-6 md:flex md:items-center">
                      <div className="md:w-1/3">
                        <label className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
                          Date of Surgery
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input
                          className="w-full appearance-none rounded border-2 border-gray-200  px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
                          id="dateOfSurgery"
                          type="text"
                          value={caseData.dateOfSurgery}
                          onChange={handleFormFieldChange}
                        />
                      </div>
                    </div>
                  </form>
                </div>
                <div className="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6">
                  <button
                    className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold  text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                    type="button"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="mb-1 mr-1 rounded bg-green-500 px-6 py-3 text-sm font-bold text-white  shadow outline-none transition-all duration-150 ease-linear hover:bg-gray-500 focus:outline-none active:bg-emerald-600"
                    type="button"
                    onClick={handleAddCase}
                  >
                    Add Case
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      </>
    )
  );
}

