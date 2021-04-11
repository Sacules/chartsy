import { MutableRefObject } from "react";

export enum ChartType {
  Collage,
  Top50,
  Top100,
}

export type Config = {
  rows: number;
  cols: number;
  pad: number;
  showTitlesBelow: boolean;
  showTitlesAside: boolean;
  addTitle: boolean;
  imageBig: boolean;
  chartType: ChartType;
};

export type ConfigAction = {
  type: "rows" | "cols" | "pad" | "showTitlesBelow" | "showTitlesAside" | "addTitle" | "chart" | "big" | "reset";
  value: number | boolean | ChartType;
};

export type Image = {
  title: string;
  author: string;
  url: string;
};

type ImageCell = {
  img: Image;
  pos: number;
};

export type ImagesAction = {
  type: "update" | "reset";
  value: ImageCell;
};

export enum SearchType {
  Art,
  Books,
  Games,
  Music,
  Movies,
  Series,
}

export type CollageRef = ((instance: HTMLDivElement) => void) | MutableRefObject<HTMLDivElement | null> | null;
