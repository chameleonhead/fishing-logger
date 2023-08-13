import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Modal } from "./Modal";
import Button from "./Button";

const meta = {
  title: "components/common/Modal",
  component: Modal,
} as Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    title: "Modal Title",
    children: "Modal Content",
  },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>OPEN</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};
