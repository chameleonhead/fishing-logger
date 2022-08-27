import { ComponentStory, ComponentMeta } from "@storybook/react";

import { IndexPage } from "./index";

export default {
  title: "pages/IndexPage",
  component: IndexPage,
} as ComponentMeta<typeof IndexPage>;

const Template: ComponentStory<typeof IndexPage> = (args) => (
  <IndexPage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: [],
};
