import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CatchList } from "./CatchList";

export default {
  component: CatchList,
} as ComponentMeta<typeof CatchList>;

const Template: ComponentStory<typeof CatchList> = (args) => (
  <CatchList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: [
    {
      id: "1",
      catched_at: "2022-08-22T02:20",
      place: {
        latitude: "35.65809922N",
        longitude: "139.74135747E",
      },
      fish: {
        species: "オオモンハタ",
      },
      method: {
        type: "釣",
        details: "餌釣り（ゴカイ）",
      },
    },
  ],
};
