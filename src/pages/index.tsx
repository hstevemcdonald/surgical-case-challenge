import Head from "next/head";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import moment from 'moment';

import { api } from "~/utils/api";

export default function Home() {
  const cases = api.case.list.useQuery();

  const columns = [{ key: "caseId", label: "Case ID" }, { key: "patientId", label: "Patient Name" }, { key: "surgeonId", label: "Surgeon Name" }, { key: "dateOfSurgery", label: "Date of Surgery" }, { key: "procedure", label: "Procedure" }];
  const rows: any = [];
  cases.data?.map((caseRow: any) => {
    rows.push({ key: caseRow.id, caseId: caseRow.id, patientId: caseRow.patientId, surgeonId: caseRow.surgeonId, dateOfSurgery: moment(caseRow.dateOfSurgery.toString()).format("MM/DD/YYYY"), procedure: caseRow.procedure });
  })

  return (
    <>
      <Head>
        <title>Surgical Case Data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center gap-4 p-8">
          <h1 className="text-2xl font-bold">Surgical Cases</h1>
          <Table aria-label="Example table with dynamic content">
            <TableHeader columns={columns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={rows}>
              {(item: any) => (
                <TableRow key={item.key}>
                  {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  );
}
