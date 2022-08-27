import { ComponentStory, ComponentMeta } from "@storybook/react";

import { PlaceInput } from "./PlaceInput";

export default {
  title: "components/map/PlaceInput",
  component: PlaceInput,
} as ComponentMeta<typeof PlaceInput>;

const Template: ComponentStory<typeof PlaceInput> = (args) => (
  <PlaceInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
  value: { isValid: true, latitude: 35.65809922, longitude: 139.74135747 },
};
