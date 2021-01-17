import { Dispatch, createContext } from "react";

export type Image = {
  title: string;
  author: string;
  url: string;
};

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

type ImageCell = {
  img: Image;
  pos: number;
};

export type ImagesAction = {
  type: "update" | "reset";
  value: ImageCell;
};

export const ImagesContext = createContext<{ images: Image[]; dispatchImages: Dispatch<ImagesAction> }>({
  images: defaultImages(10, 10),
  dispatchImages: () => null,
});
