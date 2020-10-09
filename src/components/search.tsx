import React, { useState, useEffect } from "react";
import { Button, Input } from "semantic-ui-react";
import { getAlbum, getGame, getMovie, getSeries } from "./fetcher";
import { Image } from "./images";

export enum SearchType {
  Art,
  Books,
  Games,
  Music,
  Movies,
  Series,
}

interface Props {
  setSearch: (searchVal: SearchVal) => void;
}

export const Search: React.FC<Props> = ({ setSearch }) => {
  const [searchVal, setSearchVal] = React.useState({
    search: "",
    searchType: SearchType.Music,
    resultsImgs: Array<Image>(),
  });
  const [activeButton, setActiveButton] = useState("music");

  useEffect(() => {
    const download = async () => {
      if (searchVal.search === "") {
        return;
      }

      switch (searchVal.searchType) {
        case SearchType.Games:
          const albums = await getGame(searchVal.search);
          setSearchVal({ ...searchVal, resultsImgs: albums });
          break;

        case SearchType.Movies:
          const movies = await getMovie(searchVal.search);
          setSearchVal({ ...searchVal, resultsImgs: movies });
          break;

        case SearchType.Series:
          const series = await getSeries(searchVal.search);
          setSearchVal({ ...searchVal, resultsImgs: series });
          break;

        default:
          const games = await getAlbum(searchVal.search);
          setSearchVal({ ...searchVal, resultsImgs: games });
          break;
      }
    };

    download();
    setSearch(searchVal);
  }, [searchVal, setSearch]);

  return (
    <div>
      <Button.Group fluid>
        <Button
          basic
          active={activeButton === "music"}
          icon="music"
          onClick={(e) => {
            setSearchVal({ ...searchVal, searchType: SearchType.Music });
            setActiveButton("music");
            e.preventDefault();
          }}
        />
        <Button
          basic
          active={activeButton === "game"}
          icon="game"
          onClick={(e) => {
            setSearchVal({ ...searchVal, searchType: SearchType.Games });
            setActiveButton("game");
            e.preventDefault();
          }}
        />
        <Button
          basic
          active={activeButton === "film"}
          icon="film"
          onClick={(e) => {
            setSearchVal({ ...searchVal, searchType: SearchType.Movies });
            setActiveButton("film");
            e.preventDefault();
          }}
        />
        <Button
          basic
          active={activeButton === "tv"}
          icon="tv"
          onClick={(e) => {
            setSearchVal({ ...searchVal, searchType: SearchType.Series });
            setActiveButton("tv");
            e.preventDefault();
          }}
        />
      </Button.Group>
      <form
        onSubmit={(e) => {
          setSearchVal({ ...searchVal, search: searchVal.search });
          e.preventDefault();
        }}
      >
        <Input
          fluid
          placeholder="Search..."
          value={searchVal.search}
          onChange={(e) => {
            setSearchVal({ ...searchVal, search: e.target.value });
            e.preventDefault();
          }}
        />
      </form>
    </div>
  );
};

interface SearchVal {
  search: string;
  searchType: SearchType;
  resultsImgs: Array<Image>;
}