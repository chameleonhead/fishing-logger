import { StoryObj, Meta } from "@storybook/react";
import * as CatchDetailsStories from "./CatchDetails.stories";

import { CatchEditForm } from "./CatchEditForm";

const meta = {
  title: "components/catch/CatchEditForm",
  component: CatchEditForm,
} as Meta<typeof CatchEditForm>;

export default meta;
type Story = StoryObj<typeof CatchEditForm>;

export const Default: Story = {
  args: {
    data: CatchDetailsStories.Default.args?.data,
  },
};
