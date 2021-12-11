import { useState } from "react";

// Types
import { Image } from "@entities";

// Services
import { getMusic } from "@services";

// Components
import { SearchImage } from "@components/SearchImage";
import { useChart } from "src/contexts/ChartContext";

// const searchOptions = [
//   { value: "music", label: "Music" },
//   { value: "games", label: "Videogames" },
//   { value: "tv", label: "TV" },
//   { value: "movies", label: "Movies" },
// ];

export const Search: React.FC = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Image[]>([]);

  const {
    chart: { showSearch },
  } = useChart();

  const download = async () => {
    if (search === "") {
      return;
    }

    const music = await getMusic(search);
    setResults(music);
  };

  return (
    showSearch && (
      <div className="absolute max-w-screen max-h-screen h-full inset-0 z-10 px-4 pt-20 pb-4 bg-gray-800/50">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await download();
          }}
        >
          <input
            className="p-2 border border-gray-400 focus:border-gray-800 text-black w-full"
            type="text"
            name="search"
            value={search}
            onChange={(e) => {
              e.preventDefault();
              setSearch(e.target.value);
            }}
          />
        </form>
        {results.length > 0 && (
          <ul className="mt-4 flex flex-col bg-white max-h-[75vh] p-4 overflow-y-scroll">
            {results.map((r) => (
              <SearchImage img={r} key={r.url} />
            ))}
          </ul>
        )}
      </div>
    )
  );
};
