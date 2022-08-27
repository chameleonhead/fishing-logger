import { ComponentStory, ComponentMeta } from "@storybook/react";

import { PlaceInput } from "./PlaceInput";

export default {
  title: "components/inputs/PlaceInput",
  component: PlaceInput,
} as ComponentMeta<typeof PlaceInput>;

const Template: ComponentStory<typeof PlaceInput> = (args) => (
  <PlaceInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
  value: { latitude: 35.65809922, longitude: 139.74135747 },
};

export const withoutValue = Template.bind({});
withoutValue.args = {
  value: undefined,
};
