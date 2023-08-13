import { Meta, StoryObj } from "@storybook/react";

import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

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
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: undefined,
    },
  },
};

export const WithMenuOpenOnSmallDevice: Story = {
  args: {
    menuOpen: true,
  },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: "iphone5",
    },
  },
};

export const WithMenuCloseOnSmallDevice: Story = {
  args: {
    menuOpen: false,
  },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: "iphone5",
    },
  },
};
