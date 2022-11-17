import { forwardRef, useRef, useState } from "react";

// Hooks
import { useChart, ChartProvider } from "@contexts/ChartContext";

// Contexts
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
      <Search results={results} />
      <Config />
    </>
  );
};

function App() {
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
    <main className="min-h-screen md:flex">
      <RefNav ref={ref} />
      <ConfigProvider>
        <ChartProvider>
          <Main showConfig={showConfig} />
          <RefChart ref={ref} />
        </ChartProvider>
      </ConfigProvider>
    </main>
  );
}

export default App;
