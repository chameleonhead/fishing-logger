import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";

import { CatchDetails } from "./CatchDetails";

export default {
  title: "components/catch/CatchDetails",
  component: CatchDetails,
  decorators: [(story) => <MemoryRouter>{story()}</MemoryRouter>],
} as ComponentMeta<typeof CatchDetails>;

const Template: ComponentStory<typeof CatchDetails> = (args) => (
  <CatchDetails {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: {
    id: "1",
    catched_at: "2022-08-22T02:20:00Z",
    place: {
      latitude: 35.65809922,
      longitude: 139.74135747,
    },
    fishes: [
      {
        species: "オオモンハタ",
        sizeText: "20cm",
        count: 1,
      },
    ],
    method: {
      type: "釣",
      details: "餌釣り（ゴカイ）",
    },
    media: [{ id: "id1" }],
  },
};
