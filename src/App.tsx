import { useRef, useState } from "react";

// Hooks
import { useChart, ChartProvider } from "@contexts/ChartContext";

// Contexts
import { ConfigProvider } from "@contexts/ConfigContext";

// Components
import { Nav } from "@components/Nav";
import { Chart } from "@components/Chart";
import { Search } from "@components/Search";
import { Config } from "@components/Config";
import { useMountTransition } from "./hooks/transition";

interface Props {
  showConfig: boolean;
}

const Main: React.FC<Props> = ({ showConfig }) => {
  const {
    chart: { showSearch, results },
  } = useChart();
  const hasTransitionedIn = useMountTransition(showSearch, 300);

  return (
    <>
      {(hasTransitionedIn || showSearch) && (
        <div
          className={`transition ease-in duration-75 ${
            hasTransitionedIn && showSearch ? "opacity-100" : "opacity-0"
          }`}
        >
          <Search results={results} />
        </div>
      )}
      <Config show={showConfig} />
    </>
  );
};

function App() {
  const [showConfig, setShowConfig] = useState(false);

  const ref = useRef(null);

  return (
    <main className="min-h-screen md:flex bg-slate-50">
      <Nav setShowConfig={setShowConfig} chartRef={ref} />
      <ConfigProvider>
        <ChartProvider>
          <Main showConfig={showConfig} />
          <Chart chartRef={ref} />
        </ChartProvider>
      </ConfigProvider>
    </main>
  );
}

export default App;
