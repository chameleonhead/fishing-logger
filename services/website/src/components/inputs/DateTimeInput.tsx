import { DateTimeFormatter, LocalDateTime } from "@js-joda/core";
import { useEffect, useState } from "react";
import { Row, Col, Input } from "reactstrap";

type InvalidValue = null;

type DateTimeInputProps = {
  id?: string;
  value?: LocalDateTime | InvalidValue;
  onChange?: (value?: LocalDateTime | InvalidValue) => void;
  invalid?: boolean;
};

function valueToState(value: DateTimeInputProps["value"]) {
  return {
    dateText: !value ? "" : DateTimeFormatter.ISO_LOCAL_DATE.format(value),
    timeText: !value ? "" : DateTimeFormatter.ofPattern("HH:mm").format(value),
  };
}

function tryParse(dateText: string, timeText: string) {
  if (!dateText && !timeText) {
    return undefined;
  }
  if (!dateText || !timeText) {
    return null as InvalidValue;
  }
  try {
    return DateTimeFormatter.ISO_LOCAL_DATE_TIME.parse(
      dateText + "T" + timeText
    ) as LocalDateTime;
  } catch (e) {
    return null as InvalidValue;
  }
}

export const DateTimeInput = ({
  id,
  value,
  onChange,
  invalid = false,
}: DateTimeInputProps) => {
  const [state, setState] = useState(valueToState(value));
  useEffect(() => {
    if (value !== (null as InvalidValue)) {
      setState(valueToState(value));
    }
  }, [value]);

  return (
    <Row>
      <Col xs="7" md="auto">
        <Input
          id={id}
          placeholder=""
          type="date"
          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
          value={state.dateText}
          onChange={(e) => {
            setState({ ...state, dateText: e.target.value });
            if (onChange) {
              onChange(tryParse(e.target.value, state.timeText));
            }
          }}
          invalid={invalid}
        />
      </Col>
      <Col xs="5" md="auto">
        <Input
          placeholder=""
          type="time"
          pattern="[0-9]{2}:[0-9]{2}"
          value={state.timeText}
          onChange={(e) => {
            setState({ ...state, timeText: e.target.value });
            if (onChange) {
              onChange(tryParse(state.dateText, e.target.value));
            }
          }}
          invalid={invalid}
        />
      </Col>
    </Row>
  );
};
