import Image from "next/image";

// Componentes
import { Search } from "@components/Search";

// Icons
import Settings from "./settings.svg";
import Save from "./save.svg";

export const Nav: React.FC = () => {
  return (
    <nav className="flex items-center justify-between bg-gray-700 text-white p-4">
      <button className="grid place-items-center">
        <Image
          className="filter invert"
          src={Settings}
          width={30}
          height={30}
        />
      </button>
      <Search />
      <button className="grid place-items-center">
        <Image className="filter invert" src={Save} width={30} height={30} />
      </button>
    </nav>
  );
};
