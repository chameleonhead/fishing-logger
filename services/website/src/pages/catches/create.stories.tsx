import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Layout from "../../components/common/Layout";

import { CreatePage } from "./create";

export default {
  title: "pages/catches/CreatePage",
  component: CreatePage,
  decorators: [
    (story) => (
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}> {story()}</Route>
        </Routes>
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof CreatePage>;

const Template: ComponentStory<typeof CreatePage> = (args) => (
  <CreatePage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: [],
};
