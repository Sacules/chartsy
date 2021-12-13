import Head from "next/head";
import { forwardRef, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

// Hooks
import { useChart } from "@contexts/ChartContext";

// Contexts
import { ChartProvider } from "@contexts/ChartContext";
import { ConfigProvider } from "@contexts/ConfigContext";

// Components
import { Nav } from "@components/Nav";
import { Chart } from "@components/Chart";
import { Search } from "@components/Search";
import { Config } from "@components/Config";

interface Props {
  showConfig: boolean;
}

const Main: React.FC<Props> = ({ showConfig }) => {
  const {
    chart: { showSearch, results },
  } = useChart();

  return (
    <>
      <CSSTransition
        in={showSearch}
        timeout={300}
        unmountOnExit
        classNames="search"
      >
        <Search results={results} />
      </CSSTransition>
      <CSSTransition
        in={showConfig}
        timeout={500}
        unmountOnExit
        classNames="config"
      >
        <Config />
      </CSSTransition>
    </>
  );
};

export default function Home() {
  const [showConfig, setShowConfig] = useState(false);

  const ref = useRef(null);
  const RefNav = forwardRef<HTMLUListElement>((_, ref) => (
    <Nav setShowConfig={setShowConfig} chartRef={ref} />
  ));
  RefNav.displayName = "nav";
  const RefChart = forwardRef<HTMLUListElement>((_, ref) => (
    <Chart chartRef={ref} />
  ));
  RefChart.displayName = "chart";

  return (
    <>
      <Head>
        <title>Chartsy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen">
        <RefNav ref={ref} />
        <ConfigProvider>
          <ChartProvider>
            <Main showConfig={showConfig} />
            <RefChart ref={ref} />
          </ChartProvider>
        </ConfigProvider>
      </main>
    </>
  );
}
