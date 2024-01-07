import Head from "next/head";
import {
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Autocomplete,
} from "@nextui-org/react";
import { useState } from "react";
import moment from "moment";
import { api } from "~/utils/api";

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
  const rows: any = [];
  const cases = api.case.list.useQuery().data;
  cases?.forEach((caseRow) => {
    const href = `/case?id=${caseRow.id}`;
    const idLink = <a href={href}>#{caseRow.externalId}</a>;
    rows.push({
      key: caseRow.id,
      caseId: caseRow.externalId,
      caseIdLink: idLink,
      patientName: caseRow.patient.name,
      surgeonName: caseRow.surgeon.name,
      dateOfSurgery: moment(caseRow.dateOfSurgery.toString()).format(
        "MM/DD/YYYY HH:MM",
      ),
      procedure: caseRow.procedure,
    });
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryFinal, setSearchQueryFinal] = useState("");
  const [displayRows, setDisplayRows] = useState(rows);

  // - A case detail page [see diagram below](#detail-page) that displays details on case, patient, and surgeon for a given case. Clicking on an item in the index should take you to the detail page.
  const handleSearchInput = (query: any) => {
    setSearchQuery(query.target.value);
  };
  const handleSearchInputClear = () => {
    setSearchQuery("");
    setDisplayRows(rows);
  };
  const handleSearch = (e: any) => {
    console.log(1);
    const re = new RegExp(`${searchQuery}`, "i");
    e.preventDefault();
    setSearchQueryFinal(searchQuery);
    setDisplayRows(
      rows.filter((row: any) => {
        console.log(row);
        return row.patientName.match(re) || row.caseId.match(re);
      }),
    );
  };

  return (
    <>
      <Head>
        <title>Surgical Cases</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>

      <main className="bg-gray-100 ">
        <div className="container flex flex-col items-center gap-4 p-8">
          <h1 className="text-2xl font-bold">Surgical Cases</h1>
          <form onSubmit={handleSearch}>
            <div className="flex items-center rounded-md bg-gray-200 p-2">
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
                className="ml-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                value="Go"
              />
            </div>
          </form>

          {!displayRows.length && (
            <div>
              <h4>
                No cases found
                {searchQueryFinal ? ` for '${searchQueryFinal}'` : ""}.
              </h4>
            </div>
          )}

          {displayRows.length > 0 && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
          )}
        </div>
      </main>
    </>
  );
}
