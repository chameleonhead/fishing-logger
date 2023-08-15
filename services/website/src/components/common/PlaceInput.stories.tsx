import { Meta, StoryObj } from "@storybook/react";

import { PlaceInput } from "./PlaceInput";

const meta = {
  title: "components/common/PlaceInput",
  component: PlaceInput,
} as Meta<typeof PlaceInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: { latitude: 35.65809922, longitude: 139.74135747 },
  },
};

export const WithoutValue: Story = {
  args: {
    value: undefined,
  },
};
