import React, { useReducer, useState, forwardRef, createRef } from "react";
import { Grid } from "semantic-ui-react";

import { defaultImages, ImagesContext } from "./images";
import { Search, SearchType } from "./search";
import { ConfigMenu } from "./menu";
import { Chart } from "./chart";
import { Image } from "./images";
import { onResults } from "./results";
import { ConfigContext, ConfigInitialState } from "./config";
import { configReducer, imagesReducer } from "./reducers";

export const Home: React.FC = () => {
  const [config, dispatchConfig] = useReducer(configReducer, ConfigInitialState);
  const [images, dispatchImages] = useReducer(imagesReducer, defaultImages(10, 10));

  const [resultsImgs, setResultsImgs] = useState<Image[]>([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState(SearchType.Music);

  const collageRef = createRef<HTMLDivElement>();
  const MyMenu = forwardRef<HTMLDivElement>((_, ref) => <ConfigMenu collageRef={ref} />);
  const MyChart = forwardRef<HTMLDivElement>((_, ref) => <Chart searchType={searchType} collageRef={ref} />);

  return (
    <div className="home" data-test="homeComponent">
      <Grid>
        <Grid.Column className="search" width={3}>
          <Grid.Row>
            <Search getSearch={setSearch} getSearchType={setSearchType} getResultsImgs={setResultsImgs} />
          </Grid.Row>
          <Grid.Row padded="true">{onResults(search, resultsImgs)}</Grid.Row>
        </Grid.Column>
        <ConfigContext.Provider value={{ config, dispatchConfig }}>
          <ImagesContext.Provider value={{ images, dispatchImages }}>
            <Grid.Column width={11}>
              <MyChart ref={collageRef} />
            </Grid.Column>
            <Grid.Column width={1}>
              <MyMenu ref={collageRef} />
            </Grid.Column>
          </ImagesContext.Provider>
        </ConfigContext.Provider>
      </Grid>
    </div>
  );
};
