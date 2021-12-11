import Head from "next/head";
// import { isMobile } from "react-device-detect";

// Components
import { Nav } from "@components/Nav";
import { Chart } from "@components/Chart";
import { Search } from "@components/Search";
import { ChartProvider } from "src/contexts/ChartContext";

export default function Home() {
  return (
    <>
      <Head>
        <title>Chartsy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen">
        <Nav />
        <ChartProvider>
          <Search />
          <Chart />
        </ChartProvider>
      </div>
    </>
  );
}
