import React, { useState } from "react";
import { Button, Input } from "semantic-ui-react";

export enum SearchType {
  Art,
  Books,
  Games,
  Music,
  Movies,
  Series,
}

interface Props {
  setSearch: (search: string) => void;
  setSearchType: (searchType: SearchType) => void;
}

export const Search: React.FC<Props> = ({ setSearch, setSearchType }) => {
  const [val, setVal] = useState("");
  const [activeButton, setActiveButton] = useState("music");

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
