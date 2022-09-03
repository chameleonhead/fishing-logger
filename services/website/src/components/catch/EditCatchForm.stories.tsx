import { ComponentStory, ComponentMeta } from "@storybook/react";
import * as CatchDetailsStories from "./CatchDetails.stories";

import { EditCatchForm } from "./EditCatchForm";

export default {
  title: "components/catch/EditCatchForm",
  component: EditCatchForm,
} as ComponentMeta<typeof EditCatchForm>;

const Template: ComponentStory<typeof EditCatchForm> = (args) => (
  <EditCatchForm {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: CatchDetailsStories.Default.args?.data,
};
