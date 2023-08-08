import { Meta, StoryObj } from "@storybook/react";

import { CatchCreateForm } from "./CatchCreateForm";

const meta = {
  title: "components/catch/CatchCreateForm",
  component: CatchCreateForm,
} as Meta<typeof CatchCreateForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
