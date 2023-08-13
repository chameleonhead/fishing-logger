import { Meta, StoryObj } from "@storybook/react";

import { CatchDetails } from "./CatchDetails";

const meta = {
  title: "components/catch/CatchDetails",
  component: CatchDetails,
} as Meta<typeof CatchDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      id: "1",
      catched_at: "2022-08-22T02:20:00Z",
      place: {
        latitude: 35.65809922,
        longitude: 139.74135747,
      },
      fishes: [
        {
          species: "オオモンハタ",
          size_text: "20cm",
          count: 1,
        },
      ],
      method: {
        type: "釣",
        details: "餌釣り（ゴカイ）",
      },
      media: [{ id: "id1" }],
    },
  },
};
