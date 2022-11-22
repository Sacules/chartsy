import React, { useRef, useState } from "react";

// Hooks
import { mergeProps, TextDropItem, useDrag, useDrop } from "react-aria";
import { useChart } from "@contexts/ChartContext";

// Types
import { Image } from "@entities";

interface Props {
  pos: number;
  showTitle: boolean;
  img: Image;
}

export const ChartImage: React.FC<Props> = ({ pos, img, showTitle }) => {
  const { dispatch } = useChart();

  const [droppedImg, setDroppedImg] = useState<Image>(img);
  const ref = useRef<any>();

  const { dragProps, isDragging } = useDrag({
    getItems() {
      return [{ image: JSON.stringify(img) }];
    },
    onDragStart() {
      dispatch({ type: "update", field: "positionSource", value: pos });
    },
  });
  const { dropProps, isDropTarget } = useDrop({
    ref,
    async onDrop(e) {
      const image = e.items[0] as TextDropItem;
      const sourceImg = JSON.parse(await image.getText("image"));

      setDroppedImg(sourceImg);

      dispatch({ type: "update", field: "positionTarget", value: pos });
      dispatch({ type: "swap" });
    },
  });

  const toggleSearch = () => {
    setTimeout(() => {
      dispatch({ type: "update", field: "showSearch", value: true });
      dispatch({ type: "update", field: "positionTarget", value: pos });
    }, 100);
  };

  return (
    <figure className="w-24">
      <img
        {...mergeProps(dragProps, dropProps)}
        onClick={toggleSearch}
        ref={ref}
        role="img"
        tabIndex={0}
        className={`hover:outline-cyan-600 hover:outline transition-all duration-75 shadow-md ${
          isDragging ? "opacity-50 outline-green-500" : ""
        } ${isDropTarget ? "outline outline-red-600" : ""}`}
        src={droppedImg.url}
        alt={droppedImg.author + " - " + droppedImg.title}
      />
      {showTitle && (
        <figcaption className="mt-2 text-center">
          <p className="text-sm">
            <b>{droppedImg.title}</b>
            <br />
            {droppedImg.author}
          </p>
        </figcaption>
      )}
    </figure>
  );
};
