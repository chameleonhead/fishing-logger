import { Meta, StoryObj } from "@storybook/react";
import { Route, Routes } from "react-router-dom";
import Layout from "../../components/common/Layout";

import { DetailsPage } from "./details";

const meta = {
  title: "pages/catches/DetailsPage",
  component: DetailsPage,
  decorators: [
    (story) => (
      <Routes>
        <Route path="*" element={<Layout />}>
          <Route path="*" element={story()} />
        </Route>
      </Routes>
    ),
  ],
} as Meta<typeof DetailsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "1",
  },
};
