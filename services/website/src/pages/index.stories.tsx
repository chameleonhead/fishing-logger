import { Meta, StoryObj } from "@storybook/react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/common/Layout";

import { IndexPage } from "./index";

const meta = {
  title: "pages/IndexPage",
  component: IndexPage,
  decorators: [
    (story) => (
      <Routes>
        <Route path="*" element={<Layout />}>
          <Route path="*" element={story()} />
        </Route>
      </Routes>
    ),
  ],
} as Meta<typeof IndexPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [],
  },
};
