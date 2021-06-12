import React, { useReducer, useState, forwardRef, createRef } from "react";

import { Search } from "./Search";
import Chart from "./Chart";
import Nav from "./Nav";

import { SearchType } from "../../common/entities";
import { ConfigContext, ConfigInitialState } from "../../common/config";
import { configReducer } from "../../reducers/config";
import { ImageGridProvider } from "../../common/imagegrid";
import { Sidebar, Menu } from "semantic-ui-react";
import { ConfigMenu } from "./Menu";

const Home: React.FC = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  const [config, dispatchConfig] = useReducer(configReducer, ConfigInitialState);
  const [searchType, setSearchType] = useState(SearchType.Music);

  const collageRef = createRef<HTMLDivElement>();
  const MyChart = forwardRef<HTMLDivElement>((_, ref) => <Chart searchType={searchType} collageRef={ref} />);

  return (
    <ConfigContext.Provider value={{ config, dispatchConfig }}>
      <ImageGridProvider>
        <Nav collageRef={collageRef} setShowDrawer={setShowDrawer} />
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation="push" onHide={() => setShowDrawer(false)} vertical visible={showDrawer}>
            <ConfigMenu />
          </Sidebar>

          <Sidebar.Pusher>
            <Search searchType={searchType} setSearchType={setSearchType} />
            <div className="home" data-test="homeComponent">
              <MyChart ref={collageRef} />
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </ImageGridProvider>
    </ConfigContext.Provider>
  );
};

export default Home;
