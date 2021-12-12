import Head from "next/head";

// Hooks
import { useChart } from "@contexts/ChartContext";

// Context
import { ChartProvider } from "@contexts/ChartContext";

// Components
import { Nav } from "@components/Nav";
import { Chart } from "@components/Chart";
import { Search } from "@components/Search";
import { Config } from "@components/Config";

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
        <Config />
        <Nav />
        <ChartProvider>
          <Main />
        </ChartProvider>
      </main>
    </>
  );
}
