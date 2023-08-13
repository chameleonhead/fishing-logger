import React from "react";

export type InputFieldProps = {
  name?: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "password"
    | "email"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local";
  label?: string;
  placeholder?: string;
  className?: string;
  value: string;
  readOnly?: boolean;
  disabled?: boolean;
  error?: string | string[];
  onChange?: React.ChangeEventHandler<any>;
  onBlur?: React.FocusEventHandler<any>;
};

export const InputField = ({
  name,
  type = "text",
  label,
  placeholder,
  className,
  value = "",
  error,
  readOnly = false,
  disabled = false,
  onChange: onChange,
  onBlur,
  ...props
}: InputFieldProps) => {
  const classList = [];
  if (!!error) {
    classList.push("text-red-500 border-red-500");
  } else {
    classList.push("focus:border-blue-600");
  }
  return (
    <div className={className}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          className={classList.join(" ")}
          onChange={onChange}
          onBlur={onBlur}
          readOnly={readOnly}
          disabled={disabled}
        >
          {value}
        </textarea>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          pattern={
            type === "date"
              ? "[0-9]{4}-[0-9]{2}-[0-9]{2}"
              : type === "time"
              ? "[0-9]{2}:[0-9]{2}"
              : undefined
          }
          placeholder={placeholder}
          className={classList.join(" ")}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          readOnly={readOnly}
          disabled={disabled}
          {...props}
        />
      )}
      {!!error && (
        <div className="text-sm font-medium text-red-500">{error}</div>
      )}
    </div>
  );
};
export default InputField;
