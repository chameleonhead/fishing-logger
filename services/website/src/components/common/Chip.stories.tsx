import { Meta, StoryObj } from "@storybook/react";

import { Chip } from "./Chip";

const meta = {
  title: "components/common/Chip",
  component: Chip,
} as Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Chip",
  },
};
