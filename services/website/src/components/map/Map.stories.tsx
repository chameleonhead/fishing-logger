import { StoryObj, Meta } from "@storybook/react";

import { Map } from "./Map";

const meta = { title: "components/map/Map", component: Map } as Meta<
  typeof Map
>;

export default meta;
type Story = StoryObj<typeof Map>;

export const Default: Story = {
  args: {
    position: { lat: 35.65809922, lng: 139.74135747 },
  },
};
