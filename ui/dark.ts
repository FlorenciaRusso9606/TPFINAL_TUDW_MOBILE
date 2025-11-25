import { MD3DarkTheme as PaperDark } from "react-native-paper";
import { baseTheme } from "./base";

export const darkTheme = {
  ...PaperDark,
  ...baseTheme,
  mode: "dark" as const,
  colors: {
    ...PaperDark.colors,

    
    primary: "#4C6FFF",
    onPrimary: "#0B1020",

    secondary: "#8C82FF",
    onSecondary: "#000000",

    background: "#071226",
    surface: "#071226",

    text: "#E6EEF6",
    textSecondary: "#94A3B8",

    border: "#192132",

    accent: "#26BFAA",
    success: "#34D399",
    warning: "#FBBF24",
    danger: "#FF6B6B",
    info: "#60A5FA",
  },

  components: {
    ...baseTheme.components,

    input: {
      ...baseTheme.components.inputBase,
      backgroundColor: "#071226",
      borderColor: "#192132",
    },

    button: {
      ...baseTheme.components.buttonBase,
      backgroundColor: "#4C6FFF",
    },
  },
};
