import React, { useState, useEffect, useReducer, forwardRef, createRef } from "react";
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
  // @ts-ignore
  const MyMenu = forwardRef((_, ref) => <ConfigMenu tableRef={ref} />);
  // @ts-ignore
  const MyChart = forwardRef((_, ref) => <Chart searchType={searchType} tableRef={ref} />);

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
        <Grid.Column className="search" width={2}>
          <Grid.Row>
            <Search setSearchType={setSearchType} setSearch={setSearch} />
          </Grid.Row>
          <Grid.Row padded>{onResults(search, resultsImgs)}</Grid.Row>
        </Grid.Column>
        <ConfigContext.Provider value={{ config, dispatchConfig }}>
          <Grid.Column width={12}>
            <ImagesContext.Provider value={{ images, dispatchImages }}>
              <MyChart ref={tableRef} />
            </ImagesContext.Provider>
          </Grid.Column>
          <Grid.Column width={1}>
            <MyMenu ref={tableRef} />
          </Grid.Column>
        </ConfigContext.Provider>
      </Grid>
    </div>
  );
};
