import { Dispatch, createContext, useContext } from "react";

import { Image, ImagesAction } from "../entities";

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

export const ImagesContext = createContext<{ images: Image[]; dispatchImages: Dispatch<ImagesAction> }>({
  images: defaultImages(10, 10),
  dispatchImages: () => null,
});

export const useImages = () => {
  const context = useContext(ImagesContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a Config provider");
  }

  return context;
};
