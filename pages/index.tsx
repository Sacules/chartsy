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

const CustomHead: React.FC = () => (
  <Head>
    <title>Chartsy</title>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    <meta name="msapplication-TileColor" content="#7ecce0" />
    <meta name="theme-color" content="#ffffff" />
  </Head>
);

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
      <CSSTransition in={showConfig} timeout={500} classNames="config">
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
      <CustomHead />
      <main className="min-h-screen md:flex">
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
