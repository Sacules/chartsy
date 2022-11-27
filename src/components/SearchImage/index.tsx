// Types
import { Image } from "@entities";

// Hooks
import { useChart } from "@contexts/ChartContext";
import { MouseEvent, MouseEventHandler } from "react";

let clickTimeout: number | undefined | null = null;

function clearClickTimeout() {
  if (!clickTimeout) {
    return;
  }

  clearTimeout(clickTimeout);
  clickTimeout = null;
}

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

    // prevent replacing images when the user was just scrolling through the results list
    clearClickTimeout();
    clickTimeout = window.setTimeout(() => {
      dispatch({ type: "update", field: "imageTarget", value: img });
      dispatch({ type: "replace" });
      dispatch({ type: "update", field: "showSearch", value: false });
    }, 200);
  };

  return (
    <li className="hover:outline-sky-400 hover:outline">
      <figure
        className="flex-shrink-0 flex gap-4 items-center"
        onClick={handleReplace}
        onDragEnd={() => clearClickTimeout()}
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
