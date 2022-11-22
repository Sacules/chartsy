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

  // Drag and drop
  positionSource: number;

  // Drop or search
  imageTarget: Image;
  positionTarget: number;
};

const ChartDefault: Chart = {
  showSearch: false,
  results: [],
  images: defaultImages(10, 10),
  positionSource: 0,
  imageTarget: defaultImage,
  positionTarget: 0,
};

type ChartAction = {
  type: "update" | "replace" | "swap";
  field?:
    | "showSearch"
    | "results"
    | "imageTarget"
    | "positionSource"
    | "positionTarget";
  value?: boolean | number | Image | Image[];
};

const ChartReducer = (state: Chart, action: ChartAction): Chart => {
  const images = [...state.images];

  switch (action.type) {
    case "update":
      return { ...state, [action.field as string]: action.value };
    case "replace":
      images[state.positionTarget] = state.imageTarget;
      return { ...state, images };
    case "swap":
      const temp = images[state.positionTarget];
      images[state.positionTarget] = images[state.positionSource];
      images[state.positionSource] = temp;

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
