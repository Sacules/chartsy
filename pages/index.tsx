import Head from "next/head";
import { useState } from "react";
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
    chart: { showSearch },
  } = useChart();

  return (
    <>
      <CSSTransition
        in={showSearch}
        timeout={300}
        unmountOnExit
        classNames="search"
      >
        <Search />
      </CSSTransition>
      <CSSTransition
        in={showConfig}
        timeout={500}
        unmountOnExit
        classNames="config"
      >
        <Config />
      </CSSTransition>
      <Chart />
    </>
  );
};

export default function Home() {
  const [showConfig, setShowConfig] = useState(false);
  return (
    <>
      <Head>
        <title>Chartsy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen">
        <Nav setShowConfig={setShowConfig} />
        <ConfigProvider>
          <ChartProvider>
            <Main showConfig={showConfig} />
          </ChartProvider>
        </ConfigProvider>
      </main>
    </>
  );
}
