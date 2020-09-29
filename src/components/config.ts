import { createContext, Dispatch } from "react";

export type Config = {
  rows: number;
  cols: number;
  pad: number;
  showTitles: boolean;
  addTitle: boolean;
};

export const ConfigInitialState = {
  rows: 4,
  cols: 5,
  pad: 9,
  showTitles: false,
  addTitle: false,
};

export type ConfigAction = {
  type: "rows" | "cols" | "pad" | "showTitles" | "addTitle";
  value: number | boolean;
};

export const ConfigContext = createContext<{ state: Config; dispatch: Dispatch<ConfigAction> }>({
  state: ConfigInitialState,
  dispatch: () => null,
});

export const configReducer = (state: Config, action: ConfigAction) => {
  switch (action.type) {
    case "rows":
      return { ...state, rows: action.value as number };

    case "cols":
      return { ...state, cols: action.value as number };

    case "pad":
      return { ...state, pad: action.value as number };

    case "showTitles":
      return { ...state, showTitles: action.value as boolean };

    case "addTitle":
      return { ...state, addTitle: action.value as boolean };

    default:
      return ConfigInitialState;
  }
};
