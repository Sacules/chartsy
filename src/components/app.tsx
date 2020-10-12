import React, { Fragment } from "react";
import { Home } from "./home";
import "./styles.css";

function App() {
  return (
    <Fragment>
      <div className="App" data-test="app">
        <Home />
      </div>
    </Fragment>
  );
}

export default App;
