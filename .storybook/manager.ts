import { addons } from "@storybook/manager-api";

addons.setConfig({
  navSize: 240,
  bottomPanelHeight: 200,
  panelPosition: "bottom",
  enableShortcuts: true,
  showToolbar: true,
  sidebar: {
    showRoots: true,
    order: ["Examples", "Components", "*"],
  },
});
