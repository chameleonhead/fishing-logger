import React, { ChangeEvent, useMemo } from "react";

type OptionValue = {
  value: string;
  label: string;
};

export type ToggleButtonSelectionProps = {
  id?: string;
  name?: string;
  className?: string;
  value?: OptionValue;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  options?: OptionValue[];
  disabled?: boolean;
  onBlur?: React.FocusEventHandler;
  readonly?: boolean;
};

export const ToggleButtonSelection = ({
  id,
  name,
  className,
  value,
  options,
  onChange,
  onBlur,
  disabled = false,
  readonly = false,
}: ToggleButtonSelectionProps) => {
  const selectedValue = useMemo(() => {
    if (typeof options === "undefined" || options.length === 0) {
      return undefined;
    }
    return (
      options.find((v) => v.value === value?.value || "") ||
      options[0] ||
      null
    )?.value;
  }, [value?.value, options]);

  if (typeof options === "undefined" || options.length === 0) {
    return null;
  }
  const classList = ["flex h-7"] as string[];
  if (className) {
    classList.push(className);
  }
  return (
    <div className={classList.join(" ")}>
      {options.map((option, i) => {
        return (
          <div
            key={i}
            aria-checked={selectedValue === option.value}
            className={`group grow shrink basis-0 first:border-l border-t border-r border-b h-full hover:bg-opacity-80 ${
              selectedValue === option.value
                ? "text-white bg-blue-500"
                : "text-dark bg-transparent hover:bg-blue-100 hover:text-blue-900"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${
              i === 0
                ? "rounded-l"
                : i === options.length - 1
                ? "rounded-r"
                : ""
            }`}
          >
            <div className="flex align-center justify-center h-full">
              <input
                type="radio"
                id={`${id || name}-${i}`}
                name={name}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={(e) => {
                  if (onChange && e.target.checked) {
                    onChange({
                      target: { name, value: e.target.value },
                    } as ChangeEvent<HTMLInputElement>);
                  }
                }}
                onBlur={onBlur}
                className="absolute opacity-0 w-0 h-0"
                disabled={disabled}
                readOnly={readonly}
              />
              <label
                htmlFor={`${id || name}-${i}`}
                className={`cursor-pointer select-none p-1 h-full w-full text-center truncate text-inherit peer-disabled:opacity-50 peer-disabled:cursor-not-allowed`}
              >
                {option.label}
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToggleButtonSelection;
