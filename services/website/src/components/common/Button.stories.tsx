import { Meta, StoryObj } from "@storybook/react";

import { Button, ButtonProps } from "./Button";

const meta = {
  title: "components/common/Button",
  component: Button,
} as Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const COLORS = ["primary", "secondary", "default"] as ButtonProps["color"][];
const render = ({ color, ...args }: ButtonProps) => (
  <div>
    {COLORS.map((value) => (
      <Button key={value} color={value} {...args} />
    ))}
  </div>
);

export const Default: Story = {
  args: {
    children: "Hello World",
    size: "md",
  },
  render,
};

export const Small: Story = {
  args: {
    children: "Hello World",
    size: "sm",
  },
  render,
};

export const Large: Story = {
  args: {
    children: "Hello World",
    size: "lg",
  },
  render,
};
