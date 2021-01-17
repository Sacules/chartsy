import { createContext, Dispatch } from "react";

export enum ChartType {
  Collage,
  Top50,
  Top100,
}

export type Config = {
  rows: number;
  cols: number;
  pad: number;
  showTitlesBelow: boolean;
  showTitlesAside: boolean;
  addTitle: boolean;
  imageBig: boolean;
  chartType: ChartType;
};

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

export type ConfigAction = {
  type: "rows" | "cols" | "pad" | "showTitlesBelow" | "showTitlesAside" | "addTitle" | "chart" | "big" | "reset";
  value: number | boolean | ChartType;
};

export const ConfigContext = createContext<{ config: Config; dispatchConfig: Dispatch<ConfigAction> }>({
  config: ConfigInitialState,
  dispatchConfig: () => null,
});
