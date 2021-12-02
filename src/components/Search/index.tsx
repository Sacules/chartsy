import { useState } from "react";

// Types
import { Image } from "@entities";

// Services
import { getMusic } from "@services";

// Components
import Select from "react-select";

const searchOptions = [
  { value: "music", label: "Music" },
  { value: "games", label: "Videogames" },
  { value: "tv", label: "TV" },
  { value: "movies", label: "Movies" },
];

export const Search: React.FC = () => {
  const [searchType, setSelected] = useState(searchOptions[0]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Image[]>([]);

  const download = async () => {
    if (search === "") {
      return;
    }

    switch (searchType.value) {
      case "music":
        const music = await getMusic(search);
        setResults(music);
        break;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <Select
          options={searchOptions}
          value={searchType}
          onChange={(e) => setSelected(e)}
        />
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await download();
          }}
        >
          <input
            className="px-2 border border-gray-400 focus:border-gray-800 h-9"
            type="text"
            name="search"
            value={search}
            onChange={(e) => {
              e.preventDefault();
              setSearch(e.target.value);
            }}
          />
        </form>
      </div>
      <div className="flex overflow-scroll gap-4">
        {results.map((r) => (
          <figure key={r.url} className="flex-shrink-0 w-24">
            <img className="h-24 mb-2" src={r.url}></img>
            <figcaption className="text-center">
              <p className="text-sm">
                <b>{r.title}</b> <br />
                {r.author}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};
