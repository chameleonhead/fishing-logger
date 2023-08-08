import { Meta, StoryObj } from "@storybook/react";

import { MediaThumbnail } from "./MediaThumbnail";
import sample from "./sample.json";

const meta = {
  title: "components/media/MediaThumbnail",
  component: MediaThumbnail,
} as Meta<typeof MediaThumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      id: "id",
      name: "Filename",
      content_type: "application/octet-stream",
      last_modified: "2022-09-09T12:10:13Z",
      size: 200,
      url: sample.image,
    },
  },
};

export const withImage: Story = {
  args: {
    data: {
      ...Default.args!.data!,
      content_type: "image/png",
      url: sample.image,
    },
  },
};

export const withImageWithPreviewOpen: Story = {
  args: {
    data: {
      ...Default.args!.data!,
      content_type: "image/png",
      url: sample.image,
    },
    isPreviewOpen: true,
  },
};

export const withAudio: Story = {
  args: {
    data: {
      ...Default.args!.data!,
      content_type: "audio/ogg",
      url: sample.audio,
    },
  },
};

export const withVideo: Story = {
  args: {
    data: {
      ...Default.args!.data!,
      content_type: "video/mp4",
      url: sample.video,
    },
  },
};
