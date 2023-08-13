import { StoryObj, Meta } from "@storybook/react";
import * as ShipDetailsStories from "./ShipDetails.stories";

import { ShipEditForm } from "./ShipEditForm";

const meta = {
  title: "components/ships/ShipEditForm",
  component: ShipEditForm,
} as Meta<typeof ShipEditForm>;

export default meta;
type Story = StoryObj<typeof ShipEditForm>;

export const Default: Story = {
  args: {
    data: ShipDetailsStories.Default.args?.data,
  },
};
