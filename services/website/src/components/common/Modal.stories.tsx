import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

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
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>OPEN</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};

export const Sm: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: "sm",
  },
};

export const Md: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: "md",
  },
};

export const Lg: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: "lg",
  },
};


export const Full: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: "full",
  },
};


export const SmallScreenSm: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: "sm",
  },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: "iphone5",
    },
  },
};

export const SmallScreenMd: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: "md",
  },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: "iphone5",
    },
  },
};

export const SmallScreenLg: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: "lg",
  },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: "iphone5",
    },
  },
};


export const SmallScreenFull: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: "full",
  },
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: "iphone5",
    },
  },
};
