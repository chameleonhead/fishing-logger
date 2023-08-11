import { Meta, StoryObj } from "@storybook/react";

import { AppBar } from "./AppBar";

const meta = {
  title: "components/common/AppBar",
  component: AppBar,
} as Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    menuOpen: true,
  },
};

export const WithMenuClose: Story = {
  args: {
    menuOpen: false,
  },
};
