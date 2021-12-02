import Head from "next/head";

// Components
import { Search } from "@components/Search";
import { Nav } from "@components/Nav";
import { Chart } from "@components/Chart";

export default function Home() {
  return (
    <>
      <Head>
        <title>Chartsy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid grid-rows-layout grid-cols-1 lg:grid-cols-layout">
        <Nav />
        <Search />
        <Chart />
      </div>
    </>
  );
}
