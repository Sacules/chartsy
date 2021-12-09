import { useState } from "react";

// Types
import { Image } from "@entities";

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

  const download = async () => {
    if (search === "") {
      return;
    }

    const music = await getMusic(search);
    setResults(music);
  };

  return (
    <div className="relative max-w-screen max-h-screen">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await download();
        }}
      >
        <input
          className="p-2 border border-gray-400 focus:border-gray-800 text-black"
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
        <div className="absolute mt-2 z-10 flex flex-col gap-4 bg-gray-100 p-4 overflow-y-scroll">
          {results.map((r) => (
            <SearchImage img={r} key={r.url} />
          ))}
        </div>
      )}
    </div>
  );
};
