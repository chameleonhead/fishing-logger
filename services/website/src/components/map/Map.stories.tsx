import { StoryObj, Meta } from "@storybook/react";

import { Map } from "./Map";

const meta = {
  title: "components/map/Map",
  component: Map,
} as Meta<typeof Map>;

export default meta;
type Story = StoryObj<typeof Map>;

export const Default: Story = {
  args: {
    center: { latitude: 35.65809922, longitude: 139.74135747 },
    className: "h-screen",
  },
};
