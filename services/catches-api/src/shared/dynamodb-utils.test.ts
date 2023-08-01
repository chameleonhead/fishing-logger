import {
  convertFromAttributeValue,
  convertToAttributeValue,
} from "./dynamodb-utils";

describe("dynamodb-utils", () => {
  it("should be able to convert string to AttributeValue", () => {
    expect(convertToAttributeValue("test")).toEqual({ S: "test" });
  });
  it("should be able to convert number to AttributeValue", () => {
    expect(convertToAttributeValue(1)).toEqual({ N: "1" });
  });
  it("should be able to convert boolean to AttributeValue", () => {
    expect(convertToAttributeValue(true)).toEqual({ BOOL: true });
  });
  it("should be able to convert array to AttributeValue", () => {
    expect(convertToAttributeValue(["test"])).toEqual({ L: [{ S: "test" }] });
  });
  it("should be able to convert object to AttributeValue", () => {
    expect(convertToAttributeValue({ test: "test" })).toEqual({
      M: { test: { S: "test" } },
    });
  });

  it("should be able to convert string from AttributeValue", () => {
    expect(convertFromAttributeValue({ S: "test" })).toEqual("test");
  });
  it("should be able to convert number from AttributeValue", () => {
    expect(convertFromAttributeValue({ N: "1" })).toEqual(1);
  });
  it("should be able to convert boolean from AttributeValue", () => {
    expect(convertFromAttributeValue({ BOOL: true })).toEqual(true);
  });
  it("should be able to convert array from AttributeValue", () => {
    expect(convertFromAttributeValue({ L: [{ S: "test" }] })).toEqual(["test"]);
  });
  it("should be able to convert object from AttributeValue", () => {
    expect(
      convertFromAttributeValue({
        M: { test: { S: "test" } },
      }),
    ).toEqual({ test: "test" });
  });
});
