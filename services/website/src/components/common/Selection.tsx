import { useEffect, useMemo } from "react";

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
  onChange?: React.ChangeEventHandler<any>;
  onBlur?: React.FocusEventHandler<any>;
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
  let selectedValue = useMemo(() => {
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
      } as any);
    }
  }, [selectedValue, value, readOnly, onChange]);
  const classList = [
    "block w-full shadow-sm ring-0 outline-0 border-0 -mx-1 px-1 py-2 rounded border-2 focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed",
    "bg-white focus:ring-blue-500",
  ];
  if (className) {
    classList.push(className);
  }
  if (!!error) {
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
        <select
          id={name}
          name={name}
          className={classList.join(" ")}
          value={value}
          onChange={(e) => onChange?.(e)}
          onBlur={onBlur}
          disabled={disabled}
        >
          {readOnly ? (
            <option value={value}>
              {options.filter((option) => option.value === value)[0]?.label}
            </option>
          ) : (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          )}
        </select>
      ) : null}
      {!!error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Selection;
