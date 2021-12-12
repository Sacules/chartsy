// Hooks
import { useChart } from "@contexts/ChartContext";

// Types
import { Image } from "@entities";

// Components
import { ChartImage } from "@components/ChartImage";
import { useConfig } from "@contexts/ConfigContext";

interface CollageProps {
  images: Image[];
  rows: number;
  cols: number;
  pad: number;
  showTitlesBelow: boolean;
}

const Collage: React.FC<CollageProps> = ({
  images,
  rows,
  cols,
  pad,
  showTitlesBelow,
}) => {
  images = [...images.slice(0, cols * rows)];
  return (
    <ul
      className={`transition-all grid grid-rows-${rows} grid-cols-${cols} gap-${pad} w-max`}
    >
      {images.map((img, i) => (
        <li key={`${i} - ${img.url}`}>
          <ChartImage pos={i} img={img} showTitle={showTitlesBelow} />
        </li>
      ))}
    </ul>
  );
};

export const Chart: React.FC = () => {
  const {
    chart: { images },
  } = useChart();
  const {
    config: { rows, cols, pad, showTitlesBelow },
  } = useConfig();

  return (
    <div className="p-4 overflow-scroll h-full">
      <Collage
        images={images}
        rows={rows}
        cols={cols}
        pad={pad}
        showTitlesBelow={showTitlesBelow}
      />
    </div>
  );
};
