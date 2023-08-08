import { Meta, StoryObj } from "@storybook/react";

import { MediaUploader } from "./MediaUploader";

const meta = {
  title: "components/media/MediaUploader",
  component: MediaUploader,
} as Meta<typeof MediaUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    queue: [],
  },
};

export const withQueued: Story = {
  args: {
    queue: [
      {
        id: 1,
        target: { name: "Name" } as any,
        status: "QUEUED",
        progress: 0,
      },
    ],
  },
};

export const withUploading: Story = {
  args: {
    queue: [
      {
        id: 1,
        target: { name: "Name" } as any,
        status: "UPLOADING",
        progress: 10,
      },
    ],
  },
};

export const withSucceeded: Story = {
  args: {
    queue: [
      {
        id: 1,
        target: { name: "Name" } as any,
        status: "SUCCEEDED",
        progress: 100,
      },
    ],
  },
};

export const withFailed: Story = {
  args: {
    queue: [
      {
        id: 1,
        target: { name: "Name" } as any,
        status: "FAILED",
        progress: 0,
        error: new Error("error"),
      },
    ],
  },
};
