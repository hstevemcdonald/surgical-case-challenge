import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import { api } from "~/utils/api";
import moment from "moment";

export default function AddCaseModal(props) {
  const clearCaseData = {
    patientId: "",
    patientName: "",
    surgeonId: "",
    surgeonName: "",
    procedure: "",
    diagnosis: "",
    dateOfSurgery: "",
    ICD10DiagnosisCode: "",
  };
  const { showAddCaseModal, setShowAddCaseModal, autoCompleteList } = props;
  const { patients, surgeons } = autoCompleteList;
  const [caseData, setCaseData] = useState<any>(clearCaseData);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [filteredSurgeons, setFilteredSurgeons] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const mutation = api.case.put.useMutation();

  // add case to db
  const handleAddCase = (e: any) => {
    alert("Add patient", JSON.stringify(caseData));
    // mutation.mutate();
    // close and reset fields for model
    setShowAddCaseModal(false);
    setCaseData(clearCaseData);
  };

  // close modal
  const handleClose = () => {
    setShowAddCaseModal(false);
    setCaseData(clearCaseData);
  };

  // display autocomplete list of matching patients
  const handlePatientChange = (e: any) => {
    const value = e.target.value;
    setCaseData({ ...caseData, patientName: value });

    console.log(patients);
    setFilteredPatients(
      value.length
        ? patients.filter((patient: { id: string; name: string }) => {
            const re = new RegExp(value, "i");
            return patient.id.match(re) || patient.name.match(re);
          })
        : "",
    );
  };

  // select patient
  const handleSelectPatient = (e: any) => {
    setCaseData({ ...caseData, patientName: e.name, patientId: e.id });
    setFilteredPatients([]);
  };

  // display autocomplete list of matching surgeons
  const handleSurgeonChange = (e: any) => {
    const value = e.target.value;
    setCaseData({ ...caseData, SurgeonName: value });

    setFilteredSurgeons(
      value.length
        ? surgeons.filter((surgeon: { id: string; name: string }) => {
            const re = new RegExp(value, "i");
            return surgeon.id.match(re) || surgeon.name.match(re);
          })
        : "",
    );
  };

  // select Surgeon
  const handleSelectSurgeon = (e: any) => {
    setCaseData({ ...caseData, surgeonName: e.name, surgeonId: e.id });
    setFilteredSurgeons([]);
  };

  // handle form fields
  const handleFormFieldChange = (e: any) => {
    const value = e.target.value;
    const fieldName = e.target.id;
    setCaseData({ ...caseData, [fieldName]: value });
  };

  // handle datepicker
  const handleDateChange = (date) => {
    setSelectedDate(date);
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
                  <form className="space-y-6">
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
                                key={patient.id}
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
                          id="ICD10DiagnosisCode"
                          className="w-full appearance-none rounded border-2 border-gray-200  px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
                          type="text"
                          value={caseData.ICD10DiagnosisCode}
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
                                key={surgeon.id}
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
                        <div className="relative">
                          <input
                            type="text"
                            value={
                              selectedDate
                                ? moment(selectedDate).format(selectedDate, "yyyy-MM-dd")
                                : ""
                            }
                            className="peer w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                            readOnly
                            placeholder="Select a date"
                          />
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            className="absolute right-0 top-0 z-50 mr-4 mt-3 w-full max-w-md rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                          />
                        </div>
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
