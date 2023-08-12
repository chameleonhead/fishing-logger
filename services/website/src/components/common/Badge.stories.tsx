import { Meta, StoryObj } from "@storybook/react";

import { Badge, BadgeProps } from "./Badge";

const meta = {
  title: "components/common/Badge",
  component: Badge,
} as Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const COLORS = ["primary", "secondary", "default"] as BadgeProps["color"][];
const render = (args: BadgeProps) => (
  <div>
    {COLORS.map((value) => (
      <Badge key={value} color={value} {...args} />
    ))}
  </div>
);

export const Default: Story = {
  args: {
    children: "Hello World",
  },
  render,
};
