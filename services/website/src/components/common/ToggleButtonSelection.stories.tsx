import { Meta, StoryObj } from "@storybook/react";

import { ToggleButtonSelection } from "./ToggleButtonSelection";

const meta = {
  title: "components/common/ToggleButtonSelection",
  component: ToggleButtonSelection,
} as Meta<typeof ToggleButtonSelection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Options: Story = {
  args: {
    options: [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ],
  },
};

export const Selected: Story = {
  args: {
    value: { value: "1", label: "Option 1" },
    options: [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ],
  },
};

export const Disabled: Story = {
  args: {
    value: { value: "1", label: "Option 1" },
    options: [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ],
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    value: { value: "1", label: "Option 1" },
    options: [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ],
    readonly: true,
  },
};
