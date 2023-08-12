import React from "react";
import { MemoryRouter } from "react-router-dom";
import type { Preview } from "@storybook/react";
import "../src/index.css";

import { ThemeProvider } from "@material-tailwind/react";

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
  decorators: [(story) => React.createElement(MemoryRouter, null, React.createElement(ThemeProvider, null, story()))],
};

export default preview;
