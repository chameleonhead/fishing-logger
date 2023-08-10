import React from "react";
import type { Preview } from "@storybook/react";
import { NextUIProvider } from "@nextui-org/react";
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
  decorators: [(story) => React.createElement(NextUIProvider, null, story())],
};

export default preview;
