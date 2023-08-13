import { Meta, StoryObj } from "@storybook/react";

import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

import { PageHeader } from "./PageHeader";
import Button from "./Button";

const meta = {
  title: "components/common/PageHeader",
  component: PageHeader,
} as Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Page Title",
  },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: undefined,
    },
  },
};

export const WithActionOnLargeDisplay: Story = {
  args: {
    title: "Page Title with long long long long long text",
    actions: (
      <div className="flex space-x-2">
        <Button color="primary" size="sm">
          Some Button 1
        </Button>
        <Button size="sm">Some Button 2</Button>
      </div>
    ),
  },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: undefined,
    },
  },
};

export const WithActionOnSmallDisplay: Story = {
  args: {
    title: "Page Title with long long long long long text",
    actions: (
      <div className="flex space-x-2">
        <Button color="primary" size="sm">
          Some Button 1
        </Button>
        <Button size="sm">Some Button 2</Button>
      </div>
    ),
  },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: "iphone5",
    },
  },
};
