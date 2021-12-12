import Head from "next/head";
// import { isMobile } from "react-device-detect";

// Components
import { Nav } from "@components/Nav";
import { Chart } from "@components/Chart";
import { Search } from "@components/Search";
import { ChartProvider, useChart } from "src/contexts/ChartContext";

const Main: React.FC = () => {
  const {
    chart: { showSearch },
  } = useChart();

  return (
    <>
      {showSearch && <Search />}
      <Chart />
    </>
  );
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Chartsy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen">
        <Nav />
        <ChartProvider>
          <Main />
        </ChartProvider>
      </main>
    </>
  );
}
