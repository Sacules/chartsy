import React, { useReducer, useState, forwardRef, createRef } from "react";
import { Grid } from "semantic-ui-react";

import { Search } from "./Search";
import { ConfigMenu } from "./Menu";
import Chart from "./Chart";

import { SearchType } from "../../common/entities";
import { ConfigContext, ConfigInitialState } from "../../common/config";
import { configReducer } from "../../reducers/config";
import { ImageGridProvider } from "../../common/imagegrid";

const Home: React.FC = () => {
  const [config, dispatchConfig] = useReducer(configReducer, ConfigInitialState);
  const [searchType, setSearchType] = useState(SearchType.Music);

  const collageRef = createRef<HTMLDivElement>();
  const MyMenu = forwardRef<HTMLDivElement>((_, ref) => <ConfigMenu collageRef={ref} />);
  const MyChart = forwardRef<HTMLDivElement>((_, ref) => <Chart searchType={searchType} collageRef={ref} />);

  return (
    <div className="home" data-test="homeComponent">
      <Grid>
        <ImageGridProvider>
          <Grid.Column className="search" width={3}>
            <Search searchType={searchType} setSearchType={setSearchType} />
          </Grid.Column>
          <ConfigContext.Provider value={{ config, dispatchConfig }}>
            <Grid.Column width={11}>
              <MyChart ref={collageRef} />
            </Grid.Column>
            <Grid.Column width={1}>
              <MyMenu ref={collageRef} />
            </Grid.Column>
          </ConfigContext.Provider>
        </ImageGridProvider>
      </Grid>
    </div>
  );
};

export default Home;
