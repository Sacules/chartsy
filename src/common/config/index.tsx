import React, { createContext, Dispatch, useContext, useReducer } from "react";

import { Config, ConfigAction, ChartType } from "../entities";
import { configReducer } from "../../reducers/config";

export const ConfigInitialState = {
  rows: 4,
  cols: 5,
  pad: 0,
  fontSize: 14,
  showTitlesBelow: false,
  showTitlesAside: false,
  addTitle: false,
  imageSize: 100,
  chartType: ChartType.Collage,
  chartTitle: "",
  backgroundColor: "#ffffff",
};

export const ConfigContext = createContext<{ config: Config; dispatch: Dispatch<ConfigAction> }>({
  config: { ...ConfigInitialState },
  dispatch: () => null,
});

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a Config provider");
  }

  return context;
};

export const ConfigProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(configReducer, { ...ConfigInitialState });

  return <ConfigContext.Provider value={{ config: state, dispatch }}>{children}</ConfigContext.Provider>;
};
