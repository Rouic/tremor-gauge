import type { Preview, Decorator } from "@storybook/react";
import { useEffect } from "react";
import "../src/styles.css";
import "./preview-styles.css";

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || "light";
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return Story();
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Toggle dark mode",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },
  decorators: [withTheme],
};

export default preview;
