import React, { useEffect, useState } from "react";
import { Grid, Button, Input } from "semantic-ui-react";

import ImageCard from "../Chart/ImageCard";
import { Image } from "../../../common/entities";
import { getAlbum, getGame, getMovie, getSeries } from "../../../services";
import { SearchType } from "../../../common/entities";
import { useImageGrid } from "../../../common/imagegrid";

interface Props {
  searchType: SearchType;
  setSearchType: React.Dispatch<React.SetStateAction<SearchType>>;
}

export const Search: React.FC<Props> = ({ searchType, setSearchType }) => {
  const { dispatch } = useImageGrid();

  const [activeButton, setActiveButton] = useState("music");
  const [results, setResults] = useState<Image[]>([]);
  const [tmp, setVal] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const download = async () => {
      if (search === "") {
        return;
      }

      switch (searchType) {
        case SearchType.Games:
          const albums = await getGame(search);
          setResults(albums);
          break;

        case SearchType.Movies:
          const movies = await getMovie(search);
          setResults(movies);
          break;

        case SearchType.Series:
          const series = await getSeries(search);
          setResults(series);
          break;

        default:
          const games = await getAlbum(search);
          setResults(games);
          break;
      }
    };

    download();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div id="search">
      <Grid.Row>
        <Button.Group fluid>
          <Button
            basic
            active={activeButton === "music"}
            icon="music"
            onClick={(e) => {
              dispatch({ type: "reset" });
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
              dispatch({ type: "reset" });
              setSearchType(SearchType.Games);
              setActiveButton("game");
              e.preventDefault();
            }}
          />
          {/* <Button */}
          {/*   basic */}
          {/*   active={activeButton === "film"} */}
          {/*   icon="film" */}
          {/*   onClick={(e) => { */}
          {/*     setSearchType(SearchType.Movies); */}
          {/*     setActiveButton("film"); */}
          {/*     e.preventDefault(); */}
          {/*   }} */}
          {/* /> */}
          {/* <Button */}
          {/*   basic */}
          {/*   active={activeButton === "tv"} */}
          {/*   icon="tv" */}
          {/*   onClick={(e) => { */}
          {/*     setSearchType(SearchType.Series); */}
          {/*     setActiveButton("tv"); */}
          {/*     e.preventDefault(); */}
          {/*   }} */}
          {/* /> */}
        </Button.Group>
        <form
          className="search-bar"
          onSubmit={(e) => {
            setSearch(tmp);
            e.preventDefault();
          }}
        >
          <Input
            fluid
            placeholder={`Search...${searchType === SearchType.Games ? " powered by RAWG.io" : ""}`}
            value={tmp}
            onChange={(e) => {
              setVal(e.target.value);
              e.preventDefault();
            }}
          />
        </form>
      </Grid.Row>
      <Grid.Row>
        <Grid className="results" centered padded>
          {results.map((img) => (
            <Grid.Row>
              <ImageCard onGrid={false} key={img.url} img={img} showTitle={true} />
            </Grid.Row>
          ))}
        </Grid>
      </Grid.Row>
    </div>
  );
};
