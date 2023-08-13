import { Meta, StoryObj } from "@storybook/react";

import { FileInputField } from "./FileInputField";

const meta = {
  title: "components/common/FileInputField",
  component: FileInputField,
} as Meta<typeof FileInputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "name",
    label: "Label",
    placeholder: "Placeholder",
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
