import { Meta, StoryObj } from "@storybook/react";

import { Collapse } from "./Collapse";

const meta = {
  title: "components/common/Collapse",
  component: Collapse,
} as Meta<typeof Collapse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    children: "Collapse",
  },
};
