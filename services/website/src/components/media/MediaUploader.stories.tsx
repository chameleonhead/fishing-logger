import { ComponentStory, ComponentMeta } from "@storybook/react";

import { MediaUploader } from "./MediaUploader";

export default {
  title: "components/media/MediaUploader",
  component: MediaUploader,
} as ComponentMeta<typeof MediaUploader>;

const Template: ComponentStory<typeof MediaUploader> = (args) => (
  <MediaUploader {...args} />
);

export const Default = Template.bind({});
Default.args = {
  queue: [],
};

export const withQueued = Template.bind({});
withQueued.args = {
  queue: [
    {
      id: 1,
      target: { name: "Name" } as any,
      status: "QUEUED",
      progress: 0,
    },
  ],
};

export const withUploading = Template.bind({});
withUploading.args = {
  queue: [
    {
      id: 1,
      target: { name: "Name" } as any,
      status: "UPLOADING",
      progress: 10,
    },
  ],
};

export const withSucceeded = Template.bind({});
withSucceeded.args = {
  queue: [
    {
      id: 1,
      target: { name: "Name" } as any,
      status: "SUCCEEDED",
      progress: 100,
    },
  ],
};

export const withFailed = Template.bind({});
withFailed.args = {
  queue: [
    {
      id: 1,
      target: { name: "Name" } as any,
      status: "FAILED",
      progress: 0,
      error: new Error("error"),
    },
  ],
};
