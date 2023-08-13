import {
  ChronoUnit,
  DateTimeFormatter,
  Instant,
  LocalDate,
  LocalTime,
  ZoneId,
} from "@js-joda/core";
import { useEffect, useState } from "react";
import Button from "./Button";

type InvalidValue = null;

function valueToState(value: string | InvalidValue | undefined) {
  if (typeof value !== "undefined" && value !== null && value !== "") {
    try {
      const instant = Instant.parse(value);
      return {
        dateText: !value
          ? ""
          : DateTimeFormatter.ISO_LOCAL_DATE.format(
              instant.atZone(ZoneId.SYSTEM),
            ),
        timeText: !value
          ? ""
          : DateTimeFormatter.ofPattern("HH:mm").format(
              instant.atZone(ZoneId.SYSTEM),
            ),
      };
    } catch (e) {
      console.error(e);
    }
  }
  return {
    dateText: "",
    timeText: "",
  };
}

function tryParse({
  dateText,
  timeText,
}: {
  dateText: string;
  timeText: string;
}) {
  if (!dateText && !timeText) {
    return undefined;
  }
  if (!dateText || !timeText) {
    return null as InvalidValue;
  }
  try {
    return DateTimeFormatter.ISO_INSTANT.format(
      LocalDate.parse(dateText)
        .atTime(LocalTime.parse(timeText))
        .atZone(ZoneId.SYSTEM)
        .toInstant(),
    );
  } catch (e) {
    console.error(e);
    return null as InvalidValue;
  }
}

export type DateTimeInputFieldProps = {
  name?: string;
  label?: string;
  className?: string;
  value: string;
  readOnly?: boolean;
  disabled?: boolean;
  error?: string | string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export const DateTimeInputField = ({
  name,
  label,
  className,
  value = "",
  error,
  readOnly = false,
  disabled = false,
  onChange: onChange,
  onBlur,
  ...props
}: DateTimeInputFieldProps) => {
  const [state, setState] = useState(valueToState(value));
  useEffect(() => {
    onChange &&
      onChange({
        target: { name, value: tryParse(state) },
      } as any);
  }, [name, state]);
  const classList = ["grow shrink w-auto min-w-fit sm:w-full"];
  if (!!error) {
    classList.push("text-red-500 border-red-500");
  } else {
    classList.push("focus:border-blue-600");
  }
  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor={`${name}-date`}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        <input
          id={`${name}-date`}
          name={`${name}-date`}
          type="date"
          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
          className={classList.join(" ") + " sm:col-span-2"}
          value={state.dateText}
          onChange={(e) =>
            setState({
              ...state,
              dateText: e.target.value,
            })
          }
          onBlur={onBlur}
          readOnly={readOnly}
          disabled={disabled}
          {...props}
        />
        <input
          id={`${name}-time`}
          name={`${name}-time`}
          type="time"
          pattern="[0-9]{2}:[0-9]{2}"
          className={classList.join(" ") + " sm:col-span-2"}
          value={state.timeText}
          onChange={(e) => {
            setState({
              ...state,
              timeText: e.target.value,
            });
          }}
          onBlur={onBlur}
          readOnly={readOnly}
          disabled={disabled}
          {...props}
        />
        <Button
          size="sm"
          variant="outline"
          color="default"
          className="self-end py-2 min-w-fit"
          onClick={() =>
            setState(
              valueToState(
                Instant.now().truncatedTo(ChronoUnit.MINUTES).toString(),
              ),
            )
          }
        >
          現在時刻
        </Button>
      </div>
      {!!error && (
        <div className="text-sm font-medium text-red-500">{error}</div>
      )}
    </div>
  );
};
export default DateTimeInputField;
