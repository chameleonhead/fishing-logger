import type { Meta, StoryObj } from "@storybook/react";
import { MediaList } from "./MediaList";

export default {
  component: MediaList,
} as Meta<typeof MediaList>;

export const Default: StoryObj<typeof MediaList> = {
  args: {
    data: [{ id: "1" }],
  },
};
