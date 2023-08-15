import { Meta, StoryObj } from "@storybook/react";

import { MediaThumbnail } from "./MediaThumbnail";
import sample from "./sample.json";

const meta = {
  title: "components/media/MediaThumbnail",
  component: MediaThumbnail,
  render: (args: React.ComponentProps<typeof MediaThumbnail>) => (
    <div className="h-screen">
      <MediaThumbnail {...args} />
    </div>
  ),
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

export const DefaultWithLongName: Story = {
  args: {
    data: {
      id: "id",
      name: "Filename with long long long name",
      content_type: "application/octet-stream",
      last_modified: "2022-09-09T12:10:13Z",
      size: 200,
      url: sample.image,
    },
  },
};

export const WithImage: Story = {
  args: {
    data: {
      ...Default.args!.data!,
      content_type: "image/png",
      url: sample.image,
    },
  },
};

export const WithImageWithPreviewOpen: Story = {
  args: {
    data: {
      ...Default.args!.data!,
      content_type: "image/png",
      url: sample.image,
    },
    isPreviewOpen: true,
  },
};

export const WithAudio: Story = {
  args: {
    data: {
      ...Default.args!.data!,
      content_type: "audio/ogg",
      url: sample.audio,
    },
  },
};

export const WithVideo: Story = {
  args: {
    data: {
      ...Default.args!.data!,
      content_type: "video/mp4",
      url: sample.video,
    },
  },
};
