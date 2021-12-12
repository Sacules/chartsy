import { createContext, Dispatch, useContext, useReducer } from "react";

type Chart = {
  showSearch: boolean;
};

const ChartDefault: Chart = {
  showSearch: false,
};

type ChartAction = {
  type: string;
  field?: "showSearch";
  value?: boolean;
};

const ChartReducer = (state: Chart, action: ChartAction): Chart => {
  switch (action.type) {
    case "update":
      return { ...state, [action.field as string]: action.value };
    default:
      console.log("wrong action type");
      return state;
  }
};

const ChartContext = createContext<{
  chart: Chart;
  dispatch: Dispatch<ChartAction>;
}>({
  chart: { ...ChartDefault },
  dispatch: () => null,
});

export const useChart = () => {
  const ctx = useContext(ChartContext);
  if (ctx === undefined) {
    throw new Error("ueChart must be used within a Chart provider");
  }

  return ctx;
};

export const ChartProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(ChartReducer, { ...ChartDefault });

  return (
    <ChartContext.Provider value={{ chart: state, dispatch }}>
      {children}
    </ChartContext.Provider>
  );
};
