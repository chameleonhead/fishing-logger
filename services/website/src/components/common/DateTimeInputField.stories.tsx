import { Meta, StoryObj } from "@storybook/react";

import { DateTimeInputField } from "./DateTimeInputField";

const meta = {
  title: "components/common/DateTimeInputField",
  component: DateTimeInputField,
} as Meta<typeof DateTimeInputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    name: "name",
    value: "2023-08-03T15:12:30Z",
  },
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    readOnly: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    error: "Error message",
  },
};
