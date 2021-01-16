import { Image, ImagesAction, defaultImages } from "./images";
import { Config, ConfigAction, ChartType, ConfigInitialState } from "./config";

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

    default:
      return ConfigInitialState;
  }
};

export const imagesReducer = (state: Image[], action: ImagesAction) => {
  switch (action.type) {
    case "update":
      const cell = action.value;
      state[cell.pos] = cell.img;

      localStorage.setItem("images", JSON.stringify(state));

      return state;

    default:
      return defaultImages(10, 10);
  }
};
