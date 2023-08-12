import { Meta, StoryObj } from "@storybook/react";

import { ShipLogs } from "./ShipLogs";

const meta = {
  title: "components/ships/ShipLogs",
  component: ShipLogs,
} as Meta<typeof ShipLogs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    position: {
      latitude: 34.06300569,
      longitude: 136.22153699,
    },
    logs: [
      {
        timestamp: 1633459200,
        position: {
          latitude: 34.06300569,
          longitude: 136.22153699,
        },
      },
      {
        timestamp: 1633459200,
        position: {
          latitude: 34.06331233,
          longitude: 136.22179449,
        },
      },
      {
        timestamp: 1633459200,
        position: {
          latitude: 34.06353897,
          longitude: 136.2214458,
        },
      },
      {
        timestamp: 1633459200,
        position: {
          latitude: 34.06389893,
          longitude: 136.22160137,
        },
      },
      {
        timestamp: 1633459200,
        position: {
          latitude: 34.06440998,
          longitude: 136.22257769,
        },
      },
    ],
  },
};
