import React, { useReducer, useState, forwardRef, createRef } from "react";

import { Search } from "./Search";
import { ConfigMenu } from "./Menu";
import Chart from "./Chart";
import Nav from "./Nav";

import { SearchType } from "../../common/entities";
import { ConfigContext, ConfigInitialState } from "../../common/config";
import { configReducer } from "../../reducers/config";
import { ImageGridProvider } from "../../common/imagegrid";

const Home: React.FC = () => {
  const [config, dispatchConfig] = useReducer(configReducer, ConfigInitialState);
  const [searchType, setSearchType] = useState(SearchType.Music);

  const collageRef = createRef<HTMLDivElement>();
  const MyChart = forwardRef<HTMLDivElement>((_, ref) => <Chart searchType={searchType} collageRef={ref} />);

  return (
    <ConfigContext.Provider value={{ config, dispatchConfig }}>
      <ImageGridProvider>
        <Nav collageRef={collageRef} />
        <Search searchType={searchType} setSearchType={setSearchType} />
        <ConfigMenu />
        <div className="home" data-test="homeComponent">
          <MyChart ref={collageRef} />
        </div>
      </ImageGridProvider>
    </ConfigContext.Provider>
  );
};

export default Home;
