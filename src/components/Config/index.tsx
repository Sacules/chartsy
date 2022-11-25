import { useConfig } from "@contexts/ConfigContext";
import { useRef } from "react";
import {
  mergeProps,
  useFocusRing,
  useNumberFormatter,
  useSlider,
  useSliderThumb,
  VisuallyHidden,
} from "react-aria";
import { useSliderState } from "react-stately";

interface SliderProps {
  title: string;
  value: number;
  minValue: number;
  maxValue: number;
  onChange: (val: number) => void;
}

const Thumb = ({ state, trackRef, index }: any) => {
  const inputRef = useRef(null);
  const { thumbProps, inputProps, isDragging } = useSliderThumb(
    { index, trackRef, inputRef },
    state
  );
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div
      {...thumbProps}
      className={`w-5 h-5 bg-slate-600 top-1/2 rounded-full ${
        isFocusVisible ? "bg-orange-500" : ""
      }`}
    >
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
};

const Slider: React.FC<SliderProps> = ({
  title,
  value,
  minValue,
  maxValue,
  onChange,
}) => {
  const trackRef = useRef(null);
  const numberFormatter = useNumberFormatter({ style: "decimal" });
  const state = useSliderState({
    numberFormatter,
    value,
    minValue,
    maxValue,
    onChange,
  });
  const { groupProps, trackProps, labelProps, outputProps } = useSlider(
    { label: title },
    state,
    trackRef
  );

  return (
    <div {...groupProps} className="h-8 flex flex-col gap-2">
      <div className="flex justify-between">
        <label {...labelProps}>{title}</label>
        <output {...outputProps}>{value}</output>
      </div>
      <div
        {...trackProps}
        ref={trackRef}
        className="before:content-[attr(x)] before:block before:absolute before:bg-slate-600 before:h-1 before:w-full before:top-1/2 before:-translate-y-1/2"
      >
        <Thumb index={0} state={state} trackRef={trackRef} />
      </div>
    </div>
  );
};
interface RadioProps {
  title: string;
  dispatch: () => void;
  checked: boolean;
}

const Radio: React.FC<RadioProps> = ({ title, dispatch, checked }) => (
  <label className="flex items-center" htmlFor={title}>
    <div className="relative cursor-pointer">
      <input
        id={title}
        className="sr-only"
        type="checkbox"
        checked={checked}
        onChange={dispatch}
      />
      <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
      <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
    </div>
    <p className="ml-4">{title}</p>
  </label>
);

interface Props {
  show: boolean;
}

export const Config: React.FC<Props> = ({ show }) => {
  const {
    config: { rows, cols, pad, showTitlesBelow },
    dispatch,
  } = useConfig();

  return (
    <aside
      className={`z-10 border-b border border-slate-200 overflow-hidden md:max-w-0 md:max-h-full transition-all duration-300 ${
        show ? "max-h-screen" : "max-h-0"
      }`}
    >
      <div className="p-4 bg-white flex flex-col gap-6 min-h-max md:min-w-max">
        <Slider
          title="Rows"
          value={rows}
          minValue={1}
          maxValue={10}
          onChange={(value) =>
            dispatch({ type: "update", field: "rows", value })
          }
        />
        <Slider
          title="Columns"
          value={cols}
          minValue={1}
          maxValue={10}
          onChange={(value) =>
            dispatch({ type: "update", field: "cols", value })
          }
        />
        <Slider
          title="Padding"
          value={pad}
          minValue={0}
          maxValue={8}
          onChange={(value) =>
            dispatch({ type: "update", field: "pad", value })
          }
        />
        <Radio
          title="Show titles below"
          checked={showTitlesBelow}
          dispatch={() =>
            dispatch({
              type: "update",
              field: "showTitlesBelow",
              value: !showTitlesBelow,
            })
          }
        />
      </div>
    </aside>
  );
};
