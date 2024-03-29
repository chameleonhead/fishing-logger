import { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";
import { Link as RouterLink } from "react-router-dom";

const meta = {
  title: "components/common/Button",
  component: Button,
} as Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const colors = ["primary", "secondary", "default", "danger"] as const;

const render = (args: Story["args"]) => (
  <div className="flex gap-2">
    {colors.map((color) => (
      <Button key={color} {...args} color={color} />
    ))}
  </div>
);

export const Default: Story = {
  args: {
    children: "Button",
    variant: "fill",
  },
  render,
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
  render,
};

export const Outline: Story = {
  args: {
    ...Default.args,
    variant: "outline",
  },
  render,
};

export const OutlineDisabled: Story = {
  args: {
    ...Default.args,
    variant: "outline",
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

export const AsRouterLink: Story = {
  args: {
    ...Default.args,
    as: RouterLink,
    to: "#",
  },
  render,
};
