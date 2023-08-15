import { ChangeEvent, useEffect, useMemo } from "react";
import ListBox from "./ListBox";
import ToggleButtonSelection from "./ToggleButtonSelection";

export type SelectionProps = {
  name: string;
  type?: "select" | "radio-horizontal" | "radio-vertical" | "toggle-button";
  label?: string;
  options: { value: string; label: string }[];
  className?: string;
  value: string;
  readOnly?: boolean;
  disabled?: boolean;
  error?: string;
  onChange?: React.ChangeEventHandler;
  onBlur?: React.FocusEventHandler;
};

export const Selection = ({
  name,
  type = "select",
  label,
  options,
  className,
  value = "",
  onChange: onChange,
  readOnly = false,
  disabled = false,
  error,
  onBlur,
}: SelectionProps) => {
  const selectedValue = useMemo(() => {
    const selectedValue = options.filter((option) => option.value === value)[0];
    if (typeof selectedValue == "undefined") {
      return options[0];
    }
    return selectedValue;
  }, [value, options]);

  useEffect(() => {
    if (readOnly) {
      return;
    }
    if (typeof selectedValue !== "undefined" && value !== selectedValue.value) {
      onChange?.({
        target: {
          name,
          value: selectedValue.value,
        },
      } as ChangeEvent<HTMLInputElement>);
    }
  }, [selectedValue, name, value, readOnly, onChange]);
  const classList = ["bg-white focus:ring-blue-500"];
  if (className) {
    classList.push(className);
  }
  if (error) {
    classList.push("text-red-500 border-red-500");
  }
  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      ) : null}
      {type === "select" ? (
        <ListBox
          id={name}
          name={name}
          className={classList.join(" ")}
          value={options.find((v) => v.value === value)}
          onChange={(value) =>
            onChange?.({
              target: { name: name, value: value.value },
            } as ChangeEvent<HTMLInputElement>)
          }
          onBlur={onBlur}
          disabled={disabled}
          options={options}
        />
      ) : type === "toggle-button" ? (
        <ToggleButtonSelection
          id={name}
          name={name}
          className={classList.join(" ")}
          value={options.find((v) => v.value === value)}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          options={options}
        />
      ) : null}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Selection;
