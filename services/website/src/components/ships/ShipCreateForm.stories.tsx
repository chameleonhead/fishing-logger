import { Meta, StoryObj } from "@storybook/react";

import { ShipCreateForm } from "./ShipCreateForm";

const meta = {
  title: "components/ships/ShipCreateForm",
  component: ShipCreateForm,
} as Meta<typeof ShipCreateForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
