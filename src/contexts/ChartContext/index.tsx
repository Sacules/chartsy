import { defaultImage, defaultImages, Image } from "@entities";
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";

type Chart = {
  showSearch: boolean;
  results: Image[];
  images: Image[];
  imageReplaced: Image;
  positionReplaced: number;
};

const ChartDefault: Chart = {
  showSearch: false,
  results: [],
  images: defaultImages(10, 10),
  imageReplaced: defaultImage,
  positionReplaced: 0,
};

type ChartAction = {
  type: "update" | "replace";
  field?: "showSearch" | "results" | "imageReplaced" | "positionReplaced";
  value?: boolean | number | Image | Image[];
};

const ChartReducer = (state: Chart, action: ChartAction): Chart => {
  switch (action.type) {
    case "update":
      return { ...state, [action.field as string]: action.value };
    case "replace":
      const images = [...state.images];
      images[state.positionReplaced] = state.imageReplaced;
      return { ...state, images };
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

export const ChartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(ChartReducer, { ...ChartDefault });

  return (
    <ChartContext.Provider value={{ chart: state, dispatch }}>
      {children}
    </ChartContext.Provider>
  );
};
