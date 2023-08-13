import React from "react";

export type FileInputFieldProps = {
  name?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  error?: string | string[];
  onChange?: React.ChangeEventHandler<any>;
  onBlur?: React.FocusEventHandler<any>;
};

export const FileInputField = ({
  name,
  label,
  className,
  error,
  disabled = false,
  onChange,
  onBlur,
}: FileInputFieldProps) => {
  const classList = [
    "relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] enabled:hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none  disabled:opacity-50 disabled:cursor-not-allowed",
  ];
  if (!!error) {
    classList.push("text-red-500 !border-red-500 file:bg-red-100");
  } else {
    classList.push("focus:border-blue-600");
  }
  return (
    <div className={className}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      <input
        type="file"
        id={name}
        className={classList.join(" ")}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
      {!!error && (
        <div className="text-sm font-medium text-red-500">{error}</div>
      )}
    </div>
  );
};
export default FileInputField;
