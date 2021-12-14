// Types
import { Image } from "@entities";

// Hooks
import { useChart } from "@contexts/ChartContext";
import { MouseEvent, MouseEventHandler } from "react";

interface Props {
  img: Image;
}

export const SearchImage: React.FC<Props> = ({ img }) => {
  const { dispatch } = useChart();

  const handleReplace: MouseEventHandler<HTMLElement> = (
    e: MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "update", field: "imageReplaced", value: img });
    dispatch({ type: "replace" });
    dispatch({ type: "update", field: "showSearch", value: false });
  };

  return (
    <li className="hover:outline-sky-400 hover:outline">
      <figure
        className="flex-shrink-0 flex gap-4 items-center"
        onClick={handleReplace}
      >
        <img
          className="h-24 w-24"
          src={img.url}
          alt={`${img.author} - ${img.title}`}
        ></img>
        <figcaption>
          <p className="text-sm text-black">
            <b>{img.title}</b> <br />
            {img.author}
          </p>
        </figcaption>
      </figure>
    </li>
  );
};
