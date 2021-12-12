// Types
import { Image } from "@entities";

interface Props {
  img: Image;
}

export const SearchImage: React.FC<Props> = ({ img }) => {
  // const { onClick } = useChart();

  return (
    <li className="hover:outline-sky-400 hover:outline">
      <figure
        className="flex-shrink-0 flex gap-4 items-center"
        // onTouchEnd={onClick}
        // onClick={onClick}
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
