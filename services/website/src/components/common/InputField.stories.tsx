import { Meta, StoryObj } from "@storybook/react";

import { InputField } from "./InputField";
import { useState } from "react";

const meta = {
  title: "components/common/InputField",
  component: InputField,
} as Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

const render = (args: Story["args"]) => {
  const [value, setValue] = useState(args?.value || "");
  return (
    <InputField
      {...args}
      type={args?.type || "text"}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Default: Story = {
  args: {
    name: "name",
    type: "text",
    label: "Label",
    placeholder: "Placeholder",
    value: "value",
  },
  render,
};

export const TextArea: Story = {
  args: {
    name: "name",
    type: "textarea",
    label: "Label",
    placeholder: "Placeholder",
    value: "value1\nvalue2",
  },
  render,
};

export const Number: Story = {
  args: {
    name: "name",
    type: "number",
    label: "Label",
    placeholder: "Placeholder",
    value: "123",
  },
  render,
};

export const Date: Story = {
  args: {
    name: "name",
    type: "date",
    label: "Label",
    placeholder: "Placeholder",
    value: "2023-08-13",
  },
  render,
};

export const Time: Story = {
  args: {
    name: "name",
    type: "time",
    label: "Label",
    placeholder: "Placeholder",
    value: "10:20:30",
  },
  render,
};

export const DateTime: Story = {
  args: {
    name: "name",
    type: "datetime-local",
    label: "Label",
    placeholder: "Placeholder",
    value: "2023-08-13T10:20:23.000Z",
  },
  render,
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    value: "Read Only",
    readOnly: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    value: "Disabled",
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    error: "Error message",
  },
};
