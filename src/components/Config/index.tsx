import { useConfig } from "@contexts/ConfigContext";
import { useRef } from "react";
import {
  mergeProps,
  useFocusRing,
  useNumberFormatter,
  useSlider,
  useSliderThumb,
  useSwitch,
  VisuallyHidden,
} from "react-aria";
import { useSliderState, useToggleState } from "react-stately";

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
        isDragging ? "bg-slate-500" : ""
      } ${isFocusVisible ? "bg-orange-500" : ""}`}
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
  isSelected: boolean;
  onChange: (isSelected: boolean) => void;
}

const Switch: React.FC<RadioProps> = ({ title, onChange, isSelected }) => {
  const state = useToggleState({ isSelected, onChange });
  const ref = useRef(null);
  const { inputProps } = useSwitch({ children: title }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <label className="flex items-center">
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <svg
        width={40}
        height={24}
        aria-hidden="true"
        className={`mr-2 ${
          state.isSelected ? "fill-slate-600" : "fill-slate-400"
        }`}
      >
        <rect x={4} y={4} width={32} height={16} rx={8} />
        <circle cx={state.isSelected ? 28 : 12} cy={12} r={5} fill="white" />
        {isFocusVisible && (
          <rect
            x={1}
            y={1}
            width={38}
            height={22}
            rx={11}
            fill="none"
            stroke="orange"
            strokeWidth={2}
          />
        )}
      </svg>
      {title}
    </label>
  );
};

interface ColorPickerProps {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultColor: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  title,
  onChange,
  defaultColor,
}) => (
  <div className="flex items-center gap-2">
    <input
      type="color"
      name={title}
      defaultValue={defaultColor}
      onChange={onChange}
    />
    <label htmlFor={title}>{title}</label>
  </div>
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
      className={`z-10 border-b border border-slate-200 overflow-hidden transition-all duration-300 ${
        show
          ? "max-h-screen md:max-w-screen"
          : "max-h-0 md:max-w-0 md:max-h-full"
      }`}
    >
      <div className="p-4 bg-white flex flex-col gap-6 min-h-max md:min-w-max md:h-full">
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
        <Switch
          title="Show titles below"
          isSelected={showTitlesBelow}
          onChange={(isSelected) =>
            dispatch({
              type: "update",
              field: "showTitlesBelow",
              value: isSelected,
            })
          }
        />
        <ColorPicker
          title="Background color"
          defaultColor="#FFFFFF"
          onChange={(e) =>
            dispatch({
              type: "update",
              field: "backgroundColor",
              value: e.target.value,
            })
          }
        />
      </div>
    </aside>
  );
};
