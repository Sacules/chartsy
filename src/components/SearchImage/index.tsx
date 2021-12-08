// Types
import { DragTypes, Image } from "@entities";
import { useDrag } from "react-dnd";

interface Props {
  img: Image;
}

export const SearchImage: React.FC<Props> = ({ img }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DragTypes.IMAGE,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <figure className={`flex-shrink-0 w-24 ${isDragging && "opacity-20"}`}>
      <img ref={drag} className="h-24 mb-2" src={img.url}></img>
      <figcaption className="text-center">
        <p className="text-sm">
          <b>{img.title}</b> <br />
          {img.author}
        </p>
      </figcaption>
    </figure>
  );
};
