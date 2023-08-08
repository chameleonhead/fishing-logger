import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CatchCreateForm } from "./CatchCreateForm";

export default {
  title: "components/catch/CatchCreateForm",
  component: CatchCreateForm,
} as ComponentMeta<typeof CatchCreateForm>;

const Template: ComponentStory<typeof CatchCreateForm> = (args) => (
  <CatchCreateForm {...args} />
);

export const Default = Template.bind({});
