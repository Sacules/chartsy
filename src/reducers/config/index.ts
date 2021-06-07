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

      if (action.field === "fontSize") {
        val = val as number;
        val = Math.min(Math.max(val, 14), 32);
      }

      if ((action.field === "rows" || action.field === "cols") && val === 0) {
        val = 1;
      }

      return { ...state, [action.field as string]: val };

    case "reset":
      localStorage.clear();
      return {
        ...state,
        rows: 4,
        cols: 5,
        pad: 0,
        fontSize: 14,
        showTitlesBelow: false,
        showTitlesAside: false,
        addTitle: false,
      };

    default:
      return ConfigInitialState;
  }
};
