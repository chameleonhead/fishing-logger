import React from "react";
import { MemoryRouter } from "react-router-dom";
import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [(story) => React.createElement(MemoryRouter, null, story())],
};

export default preview;
