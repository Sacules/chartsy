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
  const [search, setSearch] = useState({
    search: "",
    searchType: SearchType.Music,
    resultsImgs: Array<Image>(),
  });
  const tableRef = createRef<HTMLTableElement>();
  const MyMenu = forwardRef<HTMLTableElement>((_, ref) => <ConfigMenu tableRef={ref} />);
  const MyChart = forwardRef<HTMLTableElement>((_, ref) => <Chart searchType={search.searchType} tableRef={ref} />);

  return (
    <div className="home">
      <Grid>
        <Grid.Column className="search" width={3}>
          <Grid.Row>
            <Search setSearch={setSearch} />
          </Grid.Row>
          <Grid.Row padded>{onResults(search.search, search.resultsImgs)}</Grid.Row>
        </Grid.Column>
        <ConfigContext.Provider value={{ config, dispatchConfig }}>
          <Grid.Column width={11}>
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
