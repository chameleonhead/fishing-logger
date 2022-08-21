import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CreateCatchForm } from "./CreateCatchForm";

export default {
  component: CreateCatchForm,
} as ComponentMeta<typeof CreateCatchForm>;

const Template: ComponentStory<typeof CreateCatchForm> = (args) => (
  <CreateCatchForm {...args} />
);

export const Default = Template.bind({});
