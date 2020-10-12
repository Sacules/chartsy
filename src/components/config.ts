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
  showTitles: boolean;
  addTitle: boolean;
  imageBig: boolean;
  chartType: ChartType;
};

export const ConfigInitialState = {
  rows: 4,
  cols: 5,
  pad: 0,
  showTitles: false,
  addTitle: false,
  imageBig: false,
  chartType: ChartType.Collage,
};

export type ConfigAction = {
  type: "rows" | "cols" | "pad" | "showTitles" | "addTitle" | "chart" | "big";
  value: number | boolean | ChartType;
};

export const ConfigContext = createContext<{ config: Config; dispatchConfig: Dispatch<ConfigAction> }>({
  config: ConfigInitialState,
  dispatchConfig: () => null,
});
