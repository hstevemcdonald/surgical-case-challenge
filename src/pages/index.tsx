import Head from "next/head";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import moment from "moment";
import { api } from "~/utils/api";
import AddCaseModal from "./components/addCase";
import { any, string } from "zod";

/**
 * Nice to haves
 * - ingore out non alpha characters when entering search
 * - how to capture params from a path
 * SEE: https://github.com/trpc/trpc/tree/main/examples/next-prisma-todomvc/src
 */

const displayColumns = [
  { key: "caseIdLink", label: "Case ID" },
  { key: "patientName", label: "Patient Name" },
  { key: "surgeonName", label: "Surgeon Name" },
  { key: "dateOfSurgery", label: "Date/Time of Surgery" },
  { key: "procedure", label: "Procedure" },
];

export default function Home(props) {
  const caseRowData: any[] = [];
  const surgeonData: {
    id: string;
    name: string;
  }[] = [];
  const patientData: {
    id: string;
    name: string;
  }[] = [];
  const [cookies, setCookie, removeCookie] = useCookies(["search"]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchQueryFinal, setSearchQueryFinal] = useState<string>("");
  const [displayRows, setDisplayRows] = useState<any[]>(caseRowData);
  const [loaded, setLoaded] = useState(false);
  const [showAddCaseModal, setShowAddCaseModal] = useState<boolean>(false);
  const [autoCompleteList, setAutoCompleteList] = useState<any>({
    surgeons: surgeonData,
    patients: patientData,
  });
  const cases = api.case.list.useQuery().data;

  useEffect(() => {
    if (!cases || loaded) {
      return;
    }

    // returning to page from search result
    if (cookies?.search != undefined && cookies.search != searchQueryFinal) {
      setSearchQuery(cookies.search);
      setSearchQueryFinal(cookies.search);
      return;
    }

    // prepare condensed patient/surgeon list
    if (autoCompleteList.surgeons.length == 0) {
      const list: any = {};
      cases.forEach((caseData: any) => {
        const { patient, surgeon } = caseData;
        if (!list[patient["externalId"]]) {
          autoCompleteList.patients.push({
            id: patient["externalId"],
            name: patient["name"],
          });
          list[patient["externalId"]] = true;
        }
        if (!list[surgeon["npi"]]) {
          autoCompleteList.surgeons.push({
            id: surgeon["npi"],
            name: surgeon["name"],
          });
          list[surgeon["npi"]] = true;
        }
      });
      setAutoCompleteList(autoCompleteList);
    }

    const regexString = searchQueryFinal ? searchQueryFinal : "";
    const re = new RegExp(`${regexString}`, "i");
    cases
      .filter((caseData: any) => {
        return caseData.patient.name.match(re) || caseData.externalId.match(re);
      })
      .forEach((caseData) => {
        const href = `/case?id=${caseData.id}`;
        const idLink = <a href={href}>#{caseData.externalId}</a>;
        displayRows.push({
          key: caseData.id,
          caseId: caseData.externalId,
          caseIdLink: idLink,
          patientName: caseData.patient.name,
          surgeonName: caseData.surgeon.name,
          dateOfSurgery: moment(caseData.dateOfSurgery.toString()).format(
            "MM/DD/YYYY HH:MM",
          ),
          procedure: caseData.procedure,
        });
      });

    setDisplayRows(displayRows);
    setLoaded(true);
  });

  const handleSearchInput = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchInputClear = () => {
    setDisplayRows([]);
    setSearchQuery("");
    setSearchQueryFinal("");
    removeCookie("search");
    setLoaded(false);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    setDisplayRows([]);
    setSearchQueryFinal(searchQuery);
    setCookie("search", searchQuery);
    setLoaded(false);
  };

  const handleShowAddCase = () => {
    console.log("Show modal");
    setShowAddCaseModal(true);
  };

  function renderSearchResults() {
    return (
      searchQueryFinal && (
        <div className="mb-4 rounded-md bg-gray-200 p-2 px-4">
          <h4>
            {displayRows.length} case{displayRows.length > 1 ? "s" : ""} found
            for '{searchQueryFinal}'
          </h4>
        </div>
      )
    );
  }

  return (
    displayRows && (
      <>
        <Head>
          <title>Surgical Cases</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>
        <header className="border-b border-gray-400 bg-gray-200 p-4">
          <h1 className="text-center text-2xl font-bold">Surgical Cases</h1>
        </header>
        <main className="min-h-screen bg-gray-100">
          <div className="container mx-auto max-w-4xl pb-4 pt-4">
            <form onSubmit={handleSearch}>
              <div className="pt- flex w-full pb-5">
                <div className="flex w-3/4 items-center justify-start">
                  <input
                    type="text"
                    className="w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchInput}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="ml-2 rounded-md bg-gray-400 px-4 py-2 font-bold text-white hover:bg-gray-500"
                      onClick={handleSearchInputClear}
                    >
                      &times;
                    </button>
                  )}
                  <input
                    type="submit"
                    className="ml-2 rounded-md bg-blue-500 px-4 py-2 text-white  hover:bg-gray-500"
                    value="Go"
                  />
                </div>

                <div className="flex w-1/4 items-center justify-end">
                  <button
                    className="rounded-md bg-green-500 px-4 py-2 text-white  hover:bg-gray-500"
                    onClick={handleShowAddCase}
                  >
                    Add Case
                  </button>
                </div>
              </div>
            </form>

            {!displayRows.length && (
              <div className="mb-4 flex items-center rounded-md bg-gray-200 p-2 px-4">
                <h4>
                  No cases found
                  {searchQueryFinal ? ` for '${searchQueryFinal}'.` : "."}
                </h4>
              </div>
            )}

            {displayRows.length > 0 && (
              <>
                {renderSearchResults()}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr key="tableHeader">
                      {displayColumns.map((column) => (
                        <th
                          className={
                            "px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 " +
                            (column.key == "caseIdLink"
                              ? "text-right"
                              : "text-left")
                          }
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayRows.map((row: any) => (
                      <tr className="bg-white hover:bg-gray-100">
                        {displayColumns.map((column: any) => {
                          return (
                            <td
                              className={
                                "whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900" +
                                (column.key == "caseIdLink" && " text-right")
                              }
                            >
                              {row[column.key]}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
          <AddCaseModal
            showAddCaseModal={showAddCaseModal}
            setShowAddCaseModal={setShowAddCaseModal}
            setLoaded={setLoaded}
            autoCompleteList={autoCompleteList}
          />
        </main>
      </>
    )
  );
}
