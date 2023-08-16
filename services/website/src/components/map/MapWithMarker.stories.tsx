import { StoryObj, Meta } from "@storybook/react";

import { MapWithMarker } from "./MapWithMarker";

const meta = {
  title: "components/map/MapWithMarker",
  component: MapWithMarker,
} as Meta<typeof MapWithMarker>;

export default meta;
type Story = StoryObj<typeof MapWithMarker>;

export const Default: Story = {
  args: {
    position: { latitude: 35.65809922, longitude: 139.74135747 },
  },
};

export const WithPopup: Story = {
  args: {
    position: { latitude: 35.65809922, longitude: 139.74135747 },
    popup: "Hello!",
  },
};

export const WithPopupOnly: Story = {
  args: {
    popup: "Hello!",
  },
};
