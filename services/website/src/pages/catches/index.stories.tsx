import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Layout from "../../components/common/Layout";

import { IndexPage } from "./index";

export default {
  title: "pages/catches/IndexPage",
  component: IndexPage,
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
} as ComponentMeta<typeof IndexPage>;

const Template: ComponentStory<typeof IndexPage> = (args) => (
  <IndexPage {...args} />
);

export const Default = Template.bind({});
