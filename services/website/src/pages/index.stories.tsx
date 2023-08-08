import { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/common/Layout";

import { IndexPage } from "./index";

const meta = {
  title: "pages/IndexPage",
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
} as Meta<typeof IndexPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [],
  },
};
