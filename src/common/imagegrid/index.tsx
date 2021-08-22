import React, { Dispatch, createContext, useContext, useReducer, useEffect } from "react";

import { Image } from "../entities";
import { useTitles } from "../titles";

export const defaultImage: Image = {
  title: "",
  author: "",
  url: "https://i.imgur.com/w4toMiR.jpg",
};

export const defaultImages = (rows: number, cols: number) => {
  let images = localStorage.getItem("images");
  if (images !== null) {
    return JSON.parse(images);
  }

  let imgs: Image[] = [];
  if (imgs.length !== 0) {
    return [];
  }

  for (let i = 0; i < rows * cols; i++) {
    imgs.push(defaultImage);
  }

  return imgs;
};

type ImageSource = "collage" | "results";

export type ImageGrid = {
  images: Image[];
  draggedImage: Image;
  draggedSource: ImageSource;
  draggedTarget: ImageSource;
  positionDragged: number;
  positionTarget: number;
};

export const ImageGridDefault: ImageGrid = {
  images: defaultImages(10, 10),
  draggedImage: { ...defaultImage },
  draggedSource: "collage",
  draggedTarget: "collage",
  positionDragged: 0,
  positionTarget: 0,
};

type ImageGridAction = {
  type: "replace" | "exchange" | "update" | "reset";
  field?: "draggedImage" | "draggedSource" | "draggedTarget" | "positionDragged" | "positionTarget";
  value?: Image | ImageSource | number;
};

const ImageGridReducer = (state: ImageGrid, action: ImageGridAction): ImageGrid => {
  switch (action.type) {
    case "update":
      return { ...state, [action.field as string]: action.value };

    case "reset":
      localStorage.clear();
      return { ...ImageGridDefault };

    case "exchange":
      const images = [...state.images];
      const { positionDragged, positionTarget } = state;

      const tmp = images[positionTarget];
      images[positionTarget] = images[positionDragged];
      images[positionDragged] = tmp;

      return { ...state, images };

    case "replace":
      const imgs = [...state.images];
      imgs[state.positionTarget] = state.draggedImage;

      return { ...state, images: imgs };
  }
};

const ImageGridContext = createContext<{
  imageGrid: ImageGrid;
  dispatch: Dispatch<ImageGridAction>;
}>({
  imageGrid: { ...ImageGridDefault },
  dispatch: () => null,
});

export const useImageGrid = () => {
  const context = useContext(ImageGridContext);
  if (context === undefined) {
    throw new Error("useImages must be used within an Images provider");
  }

  return context;
};

export const ImageGridProvider: React.FC = ({ children }) => {
  const { titles, setTitles, lastUsed } = useTitles();

  const [state, dispatch] = useReducer(ImageGridReducer, titles[lastUsed].imageGrid);

  useEffect(() => {
    const t = [...titles];
    t[lastUsed].imageGrid = state;
    setTitles(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return <ImageGridContext.Provider value={{ imageGrid: state, dispatch }}>{children}</ImageGridContext.Provider>;
};
