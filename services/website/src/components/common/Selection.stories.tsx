import { Meta, StoryObj } from "@storybook/react";

import { Selection } from "./Selection";

const meta = {
  title: "components/common/Selection",
  component: Selection,
} as Meta<typeof Selection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "name",
    type: "select",
    label: "Label",
    value: "",
    options: [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ],
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

export const Select: Story = {
  args: {
    ...Default.args,
    options: [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ],
  },
};
