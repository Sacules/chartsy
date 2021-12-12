import { useEffect, useRef, useState } from "react";

// Types
import { Image } from "@entities";

// Contexts
import { useChart } from "@contexts/ChartContext";

// Services
import { getMusic } from "@services";

// Components
import { SearchImage } from "@components/SearchImage";

// const searchOptions = [
//   { value: "music", label: "Music" },
//   { value: "games", label: "Videogames" },
//   { value: "tv", label: "TV" },
//   { value: "movies", label: "Movies" },
// ];

export const Search: React.FC = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Image[]>([]);
  const { dispatch } = useChart();

  const ref = useRef(null);
  const setFocus = () => ref.current && ref.current.focus();

  const download = async () => {
    if (search === "") {
      return;
    }

    const music = await getMusic(search);
    setResults(music);
  };

  useEffect(() => setFocus(), []);

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        results.length === 0
      ) {
        dispatch({ type: "update", field: "showSearch", value: false });
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [results, dispatch]);

  return (
    <div className="absolute max-w-screen max-h-screen h-full inset-0 z-10 px-4 pt-20 pb-4 bg-gray-800/50">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await download();
        }}
      >
        <input
          ref={ref}
          className="p-2 border border-gray-400 focus:border-gray-800 text-black w-full shadow"
          type="text"
          name="search"
          value={search}
          onChange={(e) => {
            e.preventDefault();
            setSearch(e.target.value);
          }}
        />
      </form>
      <ul
        className={`transition-[height] mt-4 flex flex-col bg-white max-h-[75vh] gap-4 overflow-y-scroll ${
          results.length > 0 ? "p-4 h-full" : "p-0 h-0"
        }`}
      >
        {results.map((r) => (
          <SearchImage img={r} key={r.url} />
        ))}
      </ul>
    </div>
  );
};
