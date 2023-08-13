import { Meta, StoryObj } from "@storybook/react";

import { ShipList } from "./ShipList";

const meta = {
  title: "components/ships/ShipList",
  component: ShipList,
} as Meta<typeof ShipList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [
      {
        id: "1",
        name: "おおもと丸",
        iot_enabled: true,
      },
      {
        id: "2",
        name: "USS Enterprise",
        iot_enabled: false,
      },
    ],
  },
};
