import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";

type Config = {
  rows: number;
  cols: number;
  pad: number;
  fontSize: number;
  showTitlesBelow: boolean;
  showTitlesAside: boolean;
  addTitle: boolean;
  imageSize: number;
  // chartType: ChartType;
  chartTitle: string;
  backgroundColor: string;
};

export type ConfigAction = {
  type: "update" | "reset";
  field?:
    | "rows"
    | "cols"
    | "pad"
    | "fontSize"
    | "showTitlesBelow"
    | "showTitlesAside"
    | "addTitle"
    // | "chartType"
    | "imageSize"
    | "chartTitle"
    | "backgroundColor";
  value?: string | number | boolean;
};

export const ConfigInitialState = {
  rows: 3,
  cols: 3,
  pad: 1,
  fontSize: 14,
  showTitlesBelow: false,
  showTitlesAside: false,
  addTitle: false,
  imageSize: 100,
  // chartType: ChartType.Collage,
  chartTitle: "",
  backgroundColor: "rgb(248, 250, 252)",
};

export const configReducer = (state: Config, action: ConfigAction) => {
  switch (action.type) {
    case "update":
      let val = action.value;

      if (action.field === "pad") {
        val = val as number;
        val = val < 0 ? 0 : val % 9;
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
      // localStorage.clear();
      return {
        ...ConfigInitialState,
      };
  }
};

export const ConfigContext = createContext<{
  config: Config;
  dispatch: Dispatch<ConfigAction>;
}>({
  config: { ...ConfigInitialState },
  dispatch: () => null,
});

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a Config provider");
  }

  return context;
};

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(configReducer, {
    ...ConfigInitialState,
  });

  return (
    <ConfigContext.Provider value={{ config: state, dispatch }}>
      {children}
    </ConfigContext.Provider>
  );
};
