import { Meta, StoryObj } from "@storybook/react";

import { Progress } from "./Progress";

const meta = {
  title: "components/common/Progress",
  component: Progress,
} as Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const _0: Story = {
  args: {
    animated: false,
    value: 0,
  },
};

export const _50: Story = {
  args: {
    animated: false,
    value: 50,
  },
};

export const _100: Story = {
  args: {
    animated: false,
    value: 100,
  },
};
