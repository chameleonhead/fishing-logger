import type { Meta, StoryObj } from "@storybook/react";
import { MediaList } from "./MediaList";

const meta = {
  component: MediaList,
} as Meta<typeof MediaList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [{ id: "1" }],
  },
};
