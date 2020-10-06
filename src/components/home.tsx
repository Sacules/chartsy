import React, { useState, useEffect, useReducer, createRef } from "react";
import { Grid } from "semantic-ui-react";

import { Image, defaultImages, ImagesContext } from "./images";
import { Search, SearchType } from "./search";
import { ConfigMenu } from "./menu";
import { Chart } from "./chart";
import { getAlbum, getGame, getMovie, getSeries } from "./fetcher";
import { onResults } from "./results";
import { ConfigContext, ConfigInitialState } from "./config";
import { configReducer, imagesReducer } from "./reducers";

export const Home: React.FC = () => {
  const [resultsImgs, setResultsImgs] = useState<Image[]>([]);
  // TODO: move to the component / confg?
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState(SearchType.Music);
  const [config, dispatchConfig] = useReducer(configReducer, ConfigInitialState);
  const [images, dispatchImages] = useReducer(imagesReducer, defaultImages(10, 10));

  const tableRef = createRef<HTMLTableElement>();

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
      <Grid>
        <Grid.Column className="search" width={3}>
          <Grid.Row>
            <Search setSearchType={setSearchType} setSearch={setSearch} />
          </Grid.Row>
          <Grid.Row padded>{onResults(search, resultsImgs)}</Grid.Row>
        </Grid.Column>
        <ConfigContext.Provider value={{ config, dispatchConfig }}>
          <Grid.Column width={11}>
            <ImagesContext.Provider value={{ images, dispatchImages }}>
              <Chart searchType={searchType} tableRef={tableRef} />
            </ImagesContext.Provider>
          </Grid.Column>
          <Grid.Column width={1}>
            <ConfigMenu tableRef={tableRef} />
          </Grid.Column>
        </ConfigContext.Provider>
      </Grid>
    </div>
  );
};
