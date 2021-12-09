import Head from "next/head";
// import { isMobile } from "react-device-detect";

// Components
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
        <Chart />
      </div>
    </>
  );
}
