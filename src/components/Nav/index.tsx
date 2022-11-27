import { Dispatch, SetStateAction } from "react";
import useScreenshot from "use-screenshot-hook";

// Types
import { ChartRef } from "@entities";

interface Props {
  chartRef: ChartRef;
  setShowConfig: Dispatch<SetStateAction<boolean>>;
}

export const Nav: React.FC<Props> = ({ chartRef, setShowConfig }) => {
  const { takeScreenshot, isLoading } = useScreenshot({
    ref: chartRef,
  });

  const toggleConfig = () => setShowConfig((show) => !show);

  return (
    <nav className="z-10 shadow flex md:flex-col items-center justify-between bg-gray-700 text-white px-6 py-4 min-w-max">
      <button className="grid place-items-center" onClick={toggleConfig}>
        <img
          className="filter invert"
          alt="Settings"
          src="/settings.svg"
          width={30}
          height={30}
        />
      </button>
      <button
        className="grid place-items-center"
        onClick={async () => {
          let img = await takeScreenshot("png");
          let link = document.createElement("a");
          link.download = "chartsy.png";
          link.href = img as string;
          link.click();
        }}
      >
        {isLoading ? (
          <div className="animate-spin border-4 border-t-cyan-600 rounded-full w-6 h-6"></div>
        ) : (
          <img
            className="filter invert"
            alt="Save"
            src="/save.svg"
            width={30}
            height={30}
          />
        )}
      </button>
    </nav>
  );
};
