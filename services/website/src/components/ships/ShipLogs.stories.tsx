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
    logs: [
      {
        time: "2023-08-11T17:13:21.000000000Z",
        position: {
          latitude: 34.06300569,
          longitude: 136.22153699,
        },
      },
      {
        time: "2023-08-11T17:12:21Z",
        position: {
          latitude: 34.06331233,
          longitude: 136.22179449,
        },
      },
      {
        time: "2023-08-11T17:06:51Z",
        position: {
          latitude: 34.06353897,
          longitude: 136.2214458,
        },
      },
      {
        time: "2023-08-11T17:06:21Z",
        position: {
          latitude: 34.06389893,
          longitude: 136.22160137,
        },
      },
      {
        time: "2023-08-11T17:05:51Z",
        position: {
          latitude: 34.06440998,
          longitude: 136.22257769,
        },
      },
    ],
  },
};

export const SingleLogs: Story = {
  args: {
    logs: [
      {
        time: "2023-08-11T17:05:51Z",
        position: {
          latitude: 34.06440998,
          longitude: 136.22257769,
        },
      },
    ],
  },
};

export const NoLogs: Story = {
  args: {
    logs: [],
  },
};
