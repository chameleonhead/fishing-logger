import { Meta, StoryObj } from "@storybook/react";
import { Route, Routes } from "react-router-dom";
import Layout from "../../components/common/Layout";

import { CreatePage } from "./create";

const meta = {
  title: "pages/catches/CreatePage",
  component: CreatePage,
  decorators: [
    (story) => (
      <Routes>
        <Route path="*" element={<Layout />}>
          <Route path="*" element={story()} />
        </Route>
      </Routes>
    ),
  ],
} as Meta<typeof CreatePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [],
  },
};
