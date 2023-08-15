import { Meta, StoryObj } from "@storybook/react";

import { CatchCreateForm } from "./CatchCreateForm";

const meta = {
  title: "components/catch/CatchCreateForm",
  component: CatchCreateForm,
} as Meta<typeof CatchCreateForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialValues: {},
  },
};

export const InitialValues: Story = {
  args: {
    initialValues: {
      catched_at: "2023-08-14T01:22:34Z",
      place: {
        latitude: 35.65809922,
        longitude: 139.74135747,
      },
    },
  },
};
