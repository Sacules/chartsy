import React, { useEffect, useState } from "react";
import { Button, Input } from "semantic-ui-react";

import { Image } from "../../../common/entities";
import { getAlbum, getGame, getMovie, getSeries } from "../../../services";
import { SearchType } from "../../../common/entities";

interface Props {
  getSearch: (search: string) => void;
  getSearchType: (searchType: SearchType) => void;
  getResultsImgs: (resultsImgs: Image[]) => void;
}

export const Search: React.FC<Props> = ({ getSearch, getSearchType, getResultsImgs }) => {
  const [activeButton, setActiveButton] = useState("music");
  const [resultsImgs, setResultsImgs] = useState<Image[]>([]);
  const [val, setVal] = useState("");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState(SearchType.Music);

  useEffect(() => {
    getSearchType(searchType);
  });

  useEffect(() => {
    getSearch(search);
  });

  useEffect(() => {
    getResultsImgs(resultsImgs);
  });

  useEffect(() => {
    const download = async () => {
      if (search === "") {
        return;
      }

      switch (searchType) {
        case SearchType.Games:
          const albums = await getGame(search);
          setResultsImgs(albums);
          break;

        case SearchType.Movies:
          const movies = await getMovie(search);
          setResultsImgs(movies);
          break;

        case SearchType.Series:
          const series = await getSeries(search);
          setResultsImgs(series);
          break;

        default:
          const games = await getAlbum(search);
          setResultsImgs(games);
          break;
      }
    };

    download();
  }, [search, searchType]);

  return (
    <div>
      <Button.Group fluid>
        <Button
          basic
          active={activeButton === "music"}
          icon="music"
          onClick={(e) => {
            setSearchType(SearchType.Music);
            setActiveButton("music");
            e.preventDefault();
          }}
        />
        <Button
          basic
          active={activeButton === "game"}
          icon="game"
          onClick={(e) => {
            setSearchType(SearchType.Games);
            setActiveButton("game");
            e.preventDefault();
          }}
        />
        <Button
          basic
          active={activeButton === "film"}
          icon="film"
          onClick={(e) => {
            setSearchType(SearchType.Movies);
            setActiveButton("film");
            e.preventDefault();
          }}
        />
        <Button
          basic
          active={activeButton === "tv"}
          icon="tv"
          onClick={(e) => {
            setSearchType(SearchType.Series);
            setActiveButton("tv");
            e.preventDefault();
          }}
        />
      </Button.Group>
      <form
        onSubmit={(e) => {
          setSearch(val);
          e.preventDefault();
        }}
      >
        <Input
          fluid
          placeholder="Search..."
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            e.preventDefault();
          }}
        />
      </form>
    </div>
  );
};
