import { Meta, StoryObj } from "@storybook/react";

import { IconButton } from "./IconButton";
import { AcademicCapIcon } from "@heroicons/react/20/solid";

const meta = {
  title: "components/common/IconButton",
  component: IconButton,
} as Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const colors = ["primary", "secondary", "default"] as const;

const render = (args: Story["args"]) => (
  <div className="flex gap-2">
    {colors.map((color) => (
      <IconButton key={color} {...args} color={color}>
        <AcademicCapIcon />
      </IconButton>
    ))}
  </div>
);

export const Default: Story = {
  args: {},
  render,
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
  render,
};

export const SizeSm: Story = {
  args: {
    ...Default.args,
    size: "sm",
  },
  render,
};

export const SizeLg: Story = {
  args: {
    ...Default.args,
    size: "lg",
  },
  render,
};
