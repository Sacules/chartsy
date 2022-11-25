import { MutableRefObject } from "react";

// Types
export type Image = {
  title: string;
  author: string;
  url: string;
};

export type ChartRef = MutableRefObject<HTMLUListElement | null>;

// Constants
export const defaultImage: Image = {
  title: "",
  author: "",
  url: "https://i.imgur.com/w4toMiR.jpg",
};

export const defaultImages = (rows: number, cols: number) => {
  let imgs: Image[] = [];
  if (imgs.length !== 0) {
    return [];
  }

  for (let i = 0; i < rows * cols; i++) {
    imgs.push(defaultImage);
  }

  return imgs;
};

export const DragTypes = {
  IMAGE: "image",
};
