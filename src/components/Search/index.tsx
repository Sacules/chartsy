import { useEffect, useState } from "react";

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

interface Props {
  // Needed to preserve results between mounts
  results: Image[];
}

export const Search: React.FC<Props> = ({ results }) => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Image[]>([...results]);
  const { dispatch } = useChart();

  const download = async () => {
    if (search === "") {
      return;
    }

    setLoading(true);
    const resp = await getMusic(search);
    const { albums } = await resp.json();
    setLoading(false);
    setSearchResults(albums as Image[]);
  };

  useEffect(
    () =>
      dispatch({
        type: "update",
        field: "results",
        value: searchResults,
      }),
    [searchResults, dispatch]
  );

  return (
    <div className="absolute grid place-items-center max-w-screen max-h-screen h-full inset-0 z-20 px-4 pt-20 md:pt-4 pb-4 bg-gray-800/75">
      <div className="md:max-w-[75vw] w-full">
        <form
          className="p-2 flex items-center bg-white border border-gray-400 shadow gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            await download();
          }}
        >
          <input
            autoFocus
            className="focus-visible:outline-none text-black w-full bg-transparent"
            type="text"
            name="search"
            value={search}
            onChange={(e) => {
              e.preventDefault();
              setSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Escape") {
                return;
              }

              dispatch({ type: "update", field: "showSearch", value: false });
            }}
          />
          {loading && (
            <div className="animate-spin border-4 border-t-cyan-600 rounded-full w-6 h-6 bg-transparent"></div>
          )}
        </form>
        <ul
          className={`transition-[height] transition-[opacity] duration-300 mt-4 \
            flex flex-col bg-white max-h-[75vh] gap-4 overflow-y-scroll ${
              searchResults.length > 0
                ? "p-4 h-full opacity-100"
                : "p-0 h-0 opacity-0"
            }`}
        >
          {searchResults.map((r) => (
            <SearchImage img={r} key={r.url} />
          ))}
        </ul>
      </div>
    </div>
  );
};
