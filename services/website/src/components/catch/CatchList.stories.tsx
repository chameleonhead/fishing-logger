import { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";

import { CatchList } from "./CatchList";

const meta = {
  title: "components/catch/CatchList",
  component: CatchList,
  decorators: [(story) => <MemoryRouter>{story()}</MemoryRouter>],
} as Meta<typeof CatchList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [
      {
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
      },
      {
        id: "2",
        catched_at: "2022-08-22T02:20:00Z",
        place: {
          latitude: 35.65809922,
          longitude: 139.74135747,
        },
        fishes: [
          {
            species: "タコ",
            size_text: "20cm",
            count: 1,
          },
        ],
        method: {
          type: "刺突",
        },
      },
      {
        id: "3",
        catched_at: "2022-08-22T02:20:00Z",
        place: {
          latitude: 35.65809922,
          longitude: 139.74135747,
        },
        fishes: [
          {
            species: "スズキ",
            count: 1,
          },
        ],
        method: {
          type: "その他",
          details: "海から飛び出してバケツの中に入った",
        },
      },
    ],
  },
};
