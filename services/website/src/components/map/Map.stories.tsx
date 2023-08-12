import { StoryObj, Meta } from "@storybook/react";

import { Map } from "./Map";
import { LocationProvider } from "../common/LocationProvider";

const meta = {
  title: "components/map/Map",
  component: Map,
  decorators: [(story) => <LocationProvider>{story()}</LocationProvider>],
} as Meta<typeof Map>;

export default meta;
type Story = StoryObj<typeof Map>;

export const Default: Story = {
  args: {
    position: { lat: 35.65809922, lng: 139.74135747 },
  },
};
