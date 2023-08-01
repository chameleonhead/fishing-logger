import { AttributeValue } from "aws-lambda";

export const convertToItem = (item: any): Record<string, AttributeValue> => {
  return Object.entries(item).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: convertToAttributeValue(value),
    }),
    {},
  );
};

export const convertFromItem = (item: Record<string, AttributeValue>): any => {
  return Object.entries(item).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: convertFromAttributeValue(value),
    }),
    {},
  );
};

export const convertToAttributeValue = (value: any): AttributeValue => {
  switch (typeof value) {
    case "string":
      return { S: value };
    case "number":
      return { N: String(value) };
    case "boolean":
      return { BOOL: value };
    case "object":
      if (Array.isArray(value)) {
        return { L: value.map((item) => convertToAttributeValue(item)) };
      }
      return {
        M: Object.entries(value).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: convertToAttributeValue(value),
          }),
          {},
        ),
      };
    default:
      throw new Error(`Unsupported type: ${typeof value}`);
  }
};

export const convertFromAttributeValue = (value: AttributeValue): any => {
  if (typeof value.S !== "undefined") {
    return value.S;
  }
  if (typeof value.N !== "undefined") {
    return Number(value.N);
  }
  if (typeof value.BOOL !== "undefined") {
    return value.BOOL;
  }
  if (typeof value.L !== "undefined") {
    return value.L.map((item) => convertFromAttributeValue(item));
  }
  if (typeof value.M !== "undefined") {
    return Object.entries(value.M).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: convertFromAttributeValue(value),
      }),
      {},
    );
  }
  throw new Error(`Unsupported type: ${JSON.stringify(value)}`);
};
