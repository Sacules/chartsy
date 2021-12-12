// Types
import { Image } from "@entities";

// Hooks
import { useChart } from "src/contexts/ChartContext";

interface Props {
  img: Image;
}

export const SearchImage: React.FC<Props> = ({ img }) => {
  const { dispatch } = useChart();

  const handleReplace = (e: Event) => {
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
        onTouchEnd={handleReplace}
        onClick={handleReplace}
      >
        <img className="h-24 w-24" src={img.url}></img>
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
