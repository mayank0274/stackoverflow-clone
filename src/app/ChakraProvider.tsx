"use client";

import React from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import "@fontsource-variable/merriweather-sans";

type Props = {
  children: React.ReactNode;
};

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  semanticTokens: {
    colors: {
      primaryBgColor: {
        default: "#f0f0f0",
        _dark: "#222222 ",
      },
      secondaryBgColor: {
        default: "#ffffff",
        _dark: "#112240",
      },
      primaryHeading: {
        default: "#4d5766",
        _dark: "#ccd6f6",
      },
      subText: {
        default: "#6e7682",
        _dark: "#8892b0",
      },
      highlight: {
        default: "#26bf65",
        _dark: "#64ffda",
      },
      borderColor: {
        default: "#9c9c9c",
        _dark: "#a8b2d1",
      },
      footer: {
        default: "#ffffff86",
        _dark: "#11224087",
      },
    },
  },
  styles: {
    global: {
      "html,body": {
        background: "primaryBgColor",
      },
    },
  },
  config: config,
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Merriweather Sans Variable', sans-serif`,
  },
});

export const ChakraUiProvider: React.FC<Props> = ({ children }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
