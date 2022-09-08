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
