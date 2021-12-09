// Types
import { Image } from "@entities";

interface Props {
  img: Image;
}

export const SearchImage: React.FC<Props> = ({ img }) => {
  return (
    <figure className="flex-shrink-0 flex gap-4 items-center">
      <img className="h-24 mb-2 w-24" src={img.url}></img>
      <figcaption>
        <p className="text-sm text-black">
          <b>{img.title}</b> <br />
          {img.author}
        </p>
      </figcaption>
    </figure>
  );
};
