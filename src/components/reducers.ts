import { Image, ImagesAction, defaultImages } from "./images";
import { Config, ConfigAction, ChartType, ConfigInitialState } from "./config";

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

    case "chart":
      return { ...state, chartType: action.value as ChartType };

    default:
      return ConfigInitialState;
  }
};

export const imagesReducer = (state: Image[], action: ImagesAction) => {
  switch (action.type) {
    case "update":
      const cell = action.value;
      state[cell.pos] = cell.img;

      return state;

    default:
      return defaultImages(10, 10);
  }
};
