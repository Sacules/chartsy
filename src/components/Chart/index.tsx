// Hooks
import { useChart } from "@contexts/ChartContext";

// Types
import { Image } from "@entities";

// Components
import { ChartImage } from "@components/ChartImage";

interface CollageProps {
  images: Image[];
  rows: number;
  cols: number;
  pad: number;
}

const Collage: React.FC<CollageProps> = ({ images, rows, cols, pad }) => {
  images = [...images.slice(0, cols * rows)];
  return (
    <ul className={`grid grid-rows-${rows} grid-cols-${cols} gap-${pad} w-max`}>
      {images.map((img, i) => (
        <li key={`${i} - ${img.url}`}>
          <ChartImage pos={i} img={img} showTitle={false} />
        </li>
      ))}
    </ul>
  );
};

export const Chart: React.FC = () => {
  const {
    chart: { images },
  } = useChart();
  return (
    <div className="p-4 overflow-scroll h-full">
      <Collage images={images} rows={3} cols={4} pad={2} />
    </div>
  );
};
