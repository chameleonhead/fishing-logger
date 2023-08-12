import { Meta, StoryObj } from "@storybook/react";

import { LinkButton, LinkButtonProps } from "./LinkButton";

const meta = {
  title: "components/common/LinkButton",
  component: LinkButton,
} as Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const COLORS = [
  "primary",
  "secondary",
  "default",
] as LinkButtonProps["color"][];
const render = (args: LinkButtonProps) => (
  <div>
    {COLORS.map((value) => (
      <LinkButton key={value} color={value} {...args} />
    ))}
  </div>
);

export const Default: Story = {
  args: {
    children: "Hello World",
    size: "md",
    to: "#",
  },
  render,
};

export const Small: Story = {
  args: {
    children: "Hello World",
    size: "sm",
    to: "#",
  },
  render,
};

export const Large: Story = {
  args: {
    children: "Hello World",
    size: "lg",
    to: "#",
  },
  render,
};
