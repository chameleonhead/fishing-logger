import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type OptionValue = {
  value: string;
  label: string;
};

export type ListBoxProps = {
  id?: string;
  name?: string;
  className?: string;
  value?: OptionValue;
  onChange?: (value: OptionValue) => void;
  options?: OptionValue[];
  disabled?: boolean;
  onBlur?: React.FocusEventHandler<any>;
  readonly?: boolean;
};

export const ListBox = ({
  id,
  name,
  className,
  value,
  options,
  onChange,
  onBlur,
  disabled = false,
  readonly = false,
}: ListBoxProps) => {
  return (
    <Listbox
      name={name}
      value={value || (options && options[0]) || null}
      onChange={onChange}
      disabled={disabled}
      by="value"
    >
      <div className="relative">
        <Listbox.Button
          id={id}
          className={
            "block w-full shadow-sm ring-0 outline-0 px-2 py-0 h-7 rounded border border-1 disabled:opacity-50 disabled:cursor-not-allowed text-left" +
            (className ? ` ${className}` : "")
          }
          onBlur={onBlur}
        >
          <span className="block truncate">
            {(value || (options && options[0]) || null)?.label || " "}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 opacity-25"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        {readonly ? null : (
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 shadow-sm text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
              {options?.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none h-7 px-1 pl-8 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-blue-900">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        )}
      </div>
    </Listbox>
  );
};

export default ListBox;
