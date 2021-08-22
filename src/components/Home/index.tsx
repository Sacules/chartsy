import React, { useState, forwardRef, createRef } from "react";

import { Search } from "./Search";
import Chart from "./Chart";
import Nav from "./Nav";

import { SearchType } from "../../common/entities";
import { ImageGridProvider } from "../../common/imagegrid";
import { ConfigProvider } from "../../common/config";
import { Sidebar, Menu } from "semantic-ui-react";
import { ConfigMenu } from "./Menu";
import { TitlesProvider } from "../../common/titles";

const Home: React.FC = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [searchType, setSearchType] = useState(SearchType.Music);

  const collageRef = createRef<HTMLDivElement>();
  const MyChart = forwardRef<HTMLDivElement>((_, ref) => <Chart searchType={searchType} collageRef={ref} />);
  const MyNav = forwardRef<HTMLDivElement>((_, ref) => <Nav collageRef={ref} setShowDrawer={setShowDrawer} />);

  return (
    <TitlesProvider>
      <ConfigProvider>
        <ImageGridProvider>
          <MyNav ref={collageRef} />
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
      </ConfigProvider>
    </TitlesProvider>
  );
};

export default Home;
