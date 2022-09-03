import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Layout from "../../components/common/Layout";

import { DetailsPage } from "./details";

export default {
  title: "pages/catches/DetailsPage",
  component: DetailsPage,
  decorators: [
    (story) => (
      <MemoryRouter>
        <Routes>
          <Route path="*" element={<Layout />}>
            <Route path="*" element={story()} />
          </Route>
        </Routes>
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof DetailsPage>;

const Template: ComponentStory<typeof DetailsPage> = (args) => (
  <DetailsPage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  id: "1",
};
