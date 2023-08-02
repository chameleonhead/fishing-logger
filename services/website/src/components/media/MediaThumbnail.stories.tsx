import { ComponentStory, ComponentMeta } from "@storybook/react";

import { MediaThumbnail } from "./MediaThumbnail";
import sample from "./sample.json";

export default {
  title: "components/media/MediaThumbnail",
  component: MediaThumbnail,
} as ComponentMeta<typeof MediaThumbnail>;

const Template: ComponentStory<typeof MediaThumbnail> = (args) => (
  <MediaThumbnail {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: {
    id: "id",
    name: "Filename",
    content_type: "application/octet-stream",
    last_modified: "2022-09-09T12:10:13Z",
    size: 200,
    url: sample.image,
  },
};

export const withImage = Template.bind({});
withImage.args = {
  data: {
    ...Default.args.data!,
    content_type: "image/png",
    url: sample.image,
  },
};

export const withImageWithPreviewOpen = Template.bind({});
withImageWithPreviewOpen.args = {
  data: {
    ...Default.args.data!,
    content_type: "image/png",
    url: sample.image,
  },
  isPreviewOpen: true,
};

export const withAudio = Template.bind({});
withAudio.args = {
  data: {
    ...Default.args.data!,
    content_type: "audio/ogg",
    url: sample.audio,
  },
};

export const withVideo = Template.bind({});
withVideo.args = {
  data: {
    ...Default.args.data!,
    content_type: "video/mp4",
    url: sample.video,
  },
};
