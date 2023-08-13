import React from "react";

export type FileInputFieldProps = {
  name?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  file?: File | File[] | undefined;
  readOnly?: boolean;
  disabled?: boolean;
  error?: string | string[];
  onChange?: React.ChangeEventHandler<any>;
  onBlur?: React.FocusEventHandler<any>;
};

export const FileInputField = ({
  name,
  label,
  placeholder,
  className,
  file = undefined,
  error,
  readOnly = false,
  disabled = false,
  onChange: onChange,
  onBlur,
  ...props
}: FileInputFieldProps) => {
  const classList = [];
  if (!!error) {
    classList.push("text-red-500 border-red-500");
  } else {
    classList.push("focus:border-blue-600");
  }
  return (
    <div className={className}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      <input
        id={name}
        name={name}
        type="file"
        className="opacity-0"
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        disabled={disabled}
        {...props}
      />
      {!!error && (
        <div className="text-sm font-medium text-red-500">{error}</div>
      )}
    </div>
  );
};
export default FileInputField;
