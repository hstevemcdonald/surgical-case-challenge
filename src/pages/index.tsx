import Head from "next/head";

import { api } from "~/utils/api";

export default function Home() {
  const user = api.user.first.useQuery();

  return (
    <>
      <Head>
        <title>Surgical Case Data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center gap-4 p-8">
          <h1 className="text-2xl font-bold">Surgical Cases</h1>

          <p className="text-slate-800">
            Welcome{" "}
            {user.data?.name ?? <span className="text-slate-300">loading</span>}
            !
          </p>
        </div>
      </main>
    </>
  );
}
