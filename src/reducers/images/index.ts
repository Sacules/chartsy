import { Image, ImagesAction } from "../../common/entities";
import { defaultImages } from "../../common/images";

export const imagesReducer = (state: Image[], action: ImagesAction) => {
  switch (action.type) {
    case "update":
      const cell = action.value;
      state[cell.pos] = cell.img;

      localStorage.setItem("images", JSON.stringify(state));

      return state;

    case "reset":
      return defaultImages(10, 10);

    default:
      return defaultImages(10, 10);
  }
};
