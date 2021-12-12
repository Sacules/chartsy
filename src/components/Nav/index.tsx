import Image from "next/image";

// Icons
import Settings from "./settings.svg";
import Save from "./save.svg";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setShowConfig: Dispatch<SetStateAction<boolean>>;
}

export const Nav: React.FC<Props> = ({ setShowConfig }) => {
  const toggleConfig = () => {
    setShowConfig((show) => !show);
  };

  return (
    <nav className="flex items-center justify-between bg-gray-700 text-white p-4">
      <button className="grid place-items-center" onClick={toggleConfig}>
        <Image
          className="filter invert"
          alt="Settings"
          src={Settings}
          width={30}
          height={30}
        />
      </button>
      <button className="grid place-items-center">
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
