import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
     minHeight: {
        'screen-default': 'calc(100vh - 4rem)',
        'screen-half': 'calc(60vh - 4rem)',
      },
      screens: {
        'smweb' : "772px",
      },
      colors: {
        greenlogo: "#c6fe12",
        greentech: "#27c8c0",
        footerblue: "#002904",
        footeruplist: "#007D00",
        background: "var(--background)",
        foreground: "var(--foreground)",
        kemenkeulightblue: "#005598",
        kemenkeubluesoft: "#e6f0ff",
        kemenkeublue: "#01347c",
        kemenkeudarkerblue: "#02275d",
        kemenkeuyellow: "#ffb300",
        kemenkeuyellowsoft: "#fff6cc",
        aqua: "#00FFFF",
        farmBoldPeach: "#fca0a0ff",
        farmLiteGold: "#e8c986ff",
        farmdarkestbrown: "#45210aff",
        farmlighestbrown: "#f9d6c0ff",
        farmOrange: "#ef8c4fff",
        farmLightOrange: "#f9d6c0",
        farmLighterOrange: "#fef3e8",
        farmBlue: "#0000CD",
        farmDarkBlue: "#00008B",
        farmRed: "#FF0000",
        farmDarkRed: "#802309",
        farmdarkbrown: "#5a3828",
        farmbrown: "#724e3a",
        farmlightbrown: "#d4cea6ff",
        farmgreen: "#59a025",
        farmfreshgreen: "#7CFC00",
        farmgrassgreen: "#084724",
        farmdarkgreen: "#03371bff",
        lightNavbar: "#fffefd",
      },
      fontSize: {
        sideBarIcon: "1.2em",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        spring: ['Spring', 'sans-serif'],
      },
      animation: {
        wave: 'wave 1s infinite ease-in-out',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
