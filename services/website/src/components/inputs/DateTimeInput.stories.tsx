import { LocalDateTime } from "@js-joda/core";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DateTimeInput } from "./DateTimeInput";

export default {
  title: "components/inputs/DateTimeInput",
  component: DateTimeInput,
} as ComponentMeta<typeof DateTimeInput>;

const Template: ComponentStory<typeof DateTimeInput> = (args) => (
  <DateTimeInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
  value: LocalDateTime.now(),
};

export const withError = Template.bind({});
withError.args = {
  ...Default.args,
  invalid: true,
};
