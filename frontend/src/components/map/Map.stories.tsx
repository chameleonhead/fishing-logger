import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Map } from "./Map";

export default {
  component: Map,
} as ComponentMeta<typeof Map>;

const Template: ComponentStory<typeof Map> = (args) => <Map {...args} />;

export const Default = Template.bind({});
Default.args = {
  position: { lat: 35.65809922, lng: 139.74135747 },
};
