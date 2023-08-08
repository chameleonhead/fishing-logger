import { ComponentStory, ComponentMeta } from "@storybook/react";
import * as CatchDetailsStories from "./CatchDetails.stories";

import { CatchEditForm } from "./CatchEditForm";

export default {
  title: "components/catch/CatchEditForm",
  component: CatchEditForm,
} as ComponentMeta<typeof CatchEditForm>;

const Template: ComponentStory<typeof CatchEditForm> = (args) => (
  <CatchEditForm {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: CatchDetailsStories.Default.args?.data,
};
