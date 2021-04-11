import { createContext, Dispatch } from "react";

import { Config, ConfigAction, ChartType } from "../entities";

export const ConfigInitialState = {
  rows: 4,
  cols: 5,
  pad: 0,
  showTitlesBelow: false,
  showTitlesAside: false,
  addTitle: false,
  imageBig: false,
  chartType: ChartType.Collage,
};

export const ConfigContext = createContext<{ config: Config; dispatchConfig: Dispatch<ConfigAction> }>({
  config: ConfigInitialState,
  dispatchConfig: () => null,
});
