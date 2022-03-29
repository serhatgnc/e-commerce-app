import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const customConfig = {
    styles: {
        global: (props: any) => ({
            body: {
                color: mode("#1f1f1f", "#fff")(props),
                bgGradient: mode(
                    undefined,
                    "linear(to-t, #262355,#2E275A,#372A5E,#3F2E63,#473167,#50356C,#583870)"
                )(props),
            },
        }),
    },
    colors: {
        customPurple: {
            50: "#583870",
            100: "#50356C",
            200: "#473167",
            300: "#3F2E63",
            400: "#372A5E",
            500: "#2E275A",
            600: "#262355",
        },
        customBlackWhite: {
            50: "#1F1F1F",
            100: "#444444",
            200: "#6A6A6A",
            300: "#8F8F8F",
            400: "#B4B4B4",
            500: "#DADADA",
            600: "#FFFFFF",
        },
    },
    config: {
        initialColorMode: "light",
        useSystemColorMode: true,
    } as ThemeConfig,
};

const theme = extendTheme({ ...customConfig });

export default theme;
