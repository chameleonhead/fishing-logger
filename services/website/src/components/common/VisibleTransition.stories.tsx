import { Meta, StoryObj } from "@storybook/react";

import { VisibleTransition } from "./VisibleTransition";

const meta = {
  title: "components/common/VisibleTransition",
  component: VisibleTransition,
} as Meta<typeof VisibleTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    visible: true,
    children: (
      <div className="h-96">
        <div className="bg-red-300 p-3 h-96">Hello World</div>
      </div>
    ),
  },
};
