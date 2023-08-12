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

export const WithQueued: Story = {
  args: {
    queue: [
      {
        id: 1,
        target: { name: "Name" } as File,
        status: "QUEUED",
        progress: 0,
      },
    ],
  },
};

export const WithUploading: Story = {
  args: {
    queue: [
      {
        id: 1,
        target: { name: "Name" } as File,
        status: "UPLOADING",
        progress: 10,
      },
    ],
  },
};

export const WithSucceeded: Story = {
  args: {
    queue: [
      {
        id: 1,
        target: { name: "Name" } as File,
        status: "SUCCEEDED",
        progress: 100,
      },
    ],
  },
};

export const WithFailed: Story = {
  args: {
    queue: [
      {
        id: 1,
        target: { name: "Name" } as File,
        status: "FAILED",
        progress: 0,
        error: new Error("error"),
      },
    ],
  },
};
