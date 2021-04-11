import React, { Fragment } from "react";
import Home from "./Home";

import "./styles.css";
import "normalize.css";

const App: React.FC = () => {
  return (
    <Fragment>
      <div className="App" data-test="app">
        <Home />
      </div>
    </Fragment>
  );
};

export default App;
