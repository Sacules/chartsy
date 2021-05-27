import { ConfigInitialState } from "../../common/config";
import { Config, ConfigAction } from "../../common/entities";

export const configReducer = (state: Config, action: ConfigAction) => {
  switch (action.type) {
    case "update":
      let val = action.value;
      if (action.field === "pad") {
        val = val as number;
        val = val < 0 ? 0 : val % 5;
      }
      return { ...state, [action.field as string]: val };

    case "reset":
      localStorage.clear();
      return {
        ...state,
        rows: 4,
        cols: 5,
        pad: 0,
        showTitlesBelow: false,
        showTitlesAside: false,
        addTitle: false,
      };

    default:
      return ConfigInitialState;
  }
};
