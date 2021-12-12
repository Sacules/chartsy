import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import useScreenshot from "use-screenshot-hook";

// Types
import { ChartRef } from "@entities";

// Icons
import Settings from "./settings.svg";
import Save from "./save.svg";

interface Props {
  chartRef: ChartRef;
  setShowConfig: Dispatch<SetStateAction<boolean>>;
}

export const Nav: React.FC<Props> = ({ chartRef, setShowConfig }) => {
  // @ts-ignore
  const { takeScreenshot } = useScreenshot({ ref: chartRef });

  const toggleConfig = () => {
    setShowConfig((show) => !show);
  };

  return (
    <nav className="z-30 flex items-center justify-between bg-gray-700 text-white p-4">
      <button className="grid place-items-center" onClick={toggleConfig}>
        <Image
          className="filter invert"
          alt="Settings"
          src={Settings}
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
        <Image
          className="filter invert"
          alt="Save"
          src={Save}
          width={30}
          height={30}
        />
      </button>
    </nav>
  );
};
