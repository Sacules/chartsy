import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";

import { Image } from "./image";
import { Search, SearchType } from "./search";
import { Collage } from "./collage";
import { getAlbum, getGame, getMovie, getSeries } from "./fetcher";
import { onResults } from "./results";

export const Home: React.FC = () => {
  const [resultsImgs, setResultsImgs] = useState<Image[]>([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState(SearchType.Music);

  useEffect(() => {
    const download = async () => {
      if (search === "") {
        return;
      }

      switch (searchType) {
        case SearchType.Games:
          let albums = await getGame(search);
          setResultsImgs(albums);
          break;

        case SearchType.Movies:
          let movies = await getMovie(search);
          setResultsImgs(movies);
          break;

        case SearchType.Series:
          let series = await getSeries(search);
          setResultsImgs(series);
          break;

        default:
          let games = await getAlbum(search);
          setResultsImgs(games);
          break;
      }
    };

    download();
  }, [search, setResultsImgs, searchType]);

  return (
    <div className="home">
      <Grid padded>
        <Grid.Column width={3}>
          <Grid.Row>
            <Search setSearchType={setSearchType} setSearch={setSearch} />
          </Grid.Row>
          <Grid.Row padded>{onResults(search, resultsImgs)}</Grid.Row>
        </Grid.Column>
        <Collage />
      </Grid>
    </div>
  );
};
