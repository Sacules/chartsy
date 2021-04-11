import { ConfigInitialState } from "../../common/config";
import { Config, ConfigAction, ChartType } from "../../common/entities";

export const configReducer = (state: Config, action: ConfigAction) => {
  switch (action.type) {
    case "rows":
      return { ...state, rows: action.value as number };

    case "cols":
      return { ...state, cols: action.value as number };

    case "pad":
      let pad = action.value as number;
      pad = pad < 0 ? 0 : pad % 5;
      return { ...state, pad: pad };

    case "showTitlesBelow":
      return { ...state, showTitlesBelow: action.value as boolean };

    case "showTitlesAside":
      return { ...state, showTitlesAside: action.value as boolean };

    case "addTitle":
      return { ...state, addTitle: action.value as boolean };

    case "chart":
      return { ...state, chartType: action.value as ChartType };

    case "big":
      return { ...state, imageBig: action.value as boolean };

    case "reset":
      localStorage.clear();
      return { ...state, rows: 4, cols: 5, pad: 0, showTitlesBelow: false, showTitlesAside: false, addTitle: false };

    default:
      return ConfigInitialState;
  }
};
