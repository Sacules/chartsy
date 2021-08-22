import { createContext, Dispatch, useContext } from "react";

import { Config, ConfigAction, ChartType } from "../entities";

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

export const ConfigContext = createContext<{ config: Config; dispatchConfig: Dispatch<ConfigAction> }>({
  config: { ...ConfigInitialState },
  dispatchConfig: () => null,
});

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a Config provider");
  }

  return context;
};
