// Types
import { ChartImage } from "@components/ChartImage";
import { defaultImages, Image } from "@entities";

interface CollageProps {
  images: Image[];
  rows: number;
  cols: number;
  pad: number;
}

const Collage: React.FC<CollageProps> = ({ images, rows, cols, pad }) => {
  images = images.slice(0, cols * rows);
  return (
    <ul className={`grid grid-rows-${rows} grid-cols-${cols} gap-${pad} w-max`}>
      {images.map((img) => (
        <li key={img.url}>
          <ChartImage img={img} showTitle={false} />
        </li>
      ))}
    </ul>
  );
};

export const Chart: React.FC = () => {
  const imgs = defaultImages(10, 10);
  return (
    <div className="p-4 overflow-scroll h-full">
      <Collage images={imgs} rows={3} cols={4} pad={2} />
    </div>
  );
};
