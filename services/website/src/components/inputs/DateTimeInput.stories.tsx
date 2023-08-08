import { Meta, StoryObj } from "@storybook/react";
import { LocalDateTime } from "@js-joda/core";

import { DateTimeInput } from "./DateTimeInput";

const meta = {
  title: "components/inputs/DateTimeInput",
  component: DateTimeInput,
} as Meta<typeof DateTimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: LocalDateTime.now(),
  },
};

export const withError: Story = {
  args: {
    ...Default.args,
    invalid: true,
  },
};
