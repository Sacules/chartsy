import React, { createContext, Dispatch, useContext, useState, SetStateAction, useEffect } from "react";

import { Config } from "../entities";
import { ConfigInitialState } from "../config";
import { ImageGrid, ImageGridDefault } from "../imagegrid";

type Title = {
  config: Config;
  imageGrid: ImageGrid;
};

const TitlesDefault: Title[] = JSON.parse(localStorage.getItem("titles") as string) || [];

const TitlesContext = createContext<{
  titles: Title[];
  setTitles: Dispatch<SetStateAction<Title[]>>;
  lastUsed: number;
  setLastUsed: Dispatch<SetStateAction<number>>;
}>({
  titles: [...TitlesDefault],
  setTitles: () => null,
  lastUsed: 0,
  setLastUsed: () => null,
});

export const useTitles = () => {
  const context = useContext(TitlesContext);
  if (context === undefined) {
    throw new Error("useTitles must be used within a Titles Provider");
  }

  return context;
};

export const TitlesProvider: React.FC = ({ children }) => {
  const [titles, setTitles] = useState(
    TitlesDefault.length === 0
      ? [{ config: { ...ConfigInitialState }, imageGrid: { ...ImageGridDefault } }]
      : TitlesDefault
  );
  const [lastUsed, setLastUsed] = useState(0);

  useEffect(() => {
    localStorage.setItem("titles", JSON.stringify(titles));
    localStorage.setItem("lastUsed", JSON.stringify(lastUsed));
  }, [titles, lastUsed]);

  return (
    <TitlesContext.Provider value={{ titles, setTitles, lastUsed, setLastUsed }}>{children}</TitlesContext.Provider>
  );
};
