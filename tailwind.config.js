const defaultTheme = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        gray: {
          900: "#23211F",
          800: "#272625",
          700: "#2E2D2D",
          600: "#4A4A4A",
          500: "#646464",
          400: "#878787",
          300: "#B2B2B2",
          200: "#E3E0E0",
          100: "#FAFAFA",
          50: "#f9fafb",
        },
        primary: {
          900: "#233876",
          800: "#15569b",
          700: "#1a56db",
          600: "#1c64f2",
          500: "#3f83f8",
          400: "#76a9fa",
          300: "#a4cafe",
          200: "#c3ddfd",
          100: "#e1effe",
          50: "#ebf5ff",
        },
        green: {
          900: "#014737",
          800: "#03543f",
          700: "#046c4e",
          600: "#057a55",
          500: "#0e9f6e",
          400: "#31c48d",
          300: "#84e1bc",
          200: "#bcf0da",
          100: "#def7ec",
          50: "#f3faf7",
        },
        red: {
          900: "#771d1d",
          800: "#9b1c1c",
          700: "#c81e1e",
          600: "#e02424",
          500: "#FF5757",
          400: "#f98080",
          300: "#f8b4b4",
          200: "#fbd5d5",
          100: "#fde8e8",
          50: "#fdf2f2",
        },
        orange: {
          900: "#771d1d",
          800: "#8a2c0d",
          700: "#b43403",
          600: "#d03801",
          500: "#ff5a1f",
          400: "#ff8a4c",
          300: "#fdba8c",
          200: "#fcd9bd",
          100: "#feecdc",
          50: "#fff8f1",
        },
        indigo: {
          900: "#362f78",
          800: "#42389d",
          700: "#5145cd",
          600: "#5850ec",
          500: "#6875f5",
          400: "#8da2fb",
          300: "#b4c6fc",
          200: "#cddbfe",
          100: "#e5edff",
          50: "#f0f5ff",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      maxHeight: {
        ...defaultTheme.spacing,
      },
      maxWidth: {
        ...defaultTheme.spacing,
      },
      minHeight: {
        ...defaultTheme.spacing,
      },
      minWidth: {
        ...defaultTheme.spacing,
      },
    },
    fontSize: {
      xs: [
        "12px",
        {
          lineHeight: "1.5",
        },
      ],
      sm: [
        "14px",
        {
          lineHeight: "1.5",
        },
      ],
      base: [
        "16px",
        {
          lineHeight: "1.5",
        },
      ],
      lg: [
        "18px",
        {
          lineHeight: "1.5",
        },
      ],
      xl: [
        "20px",
        {
          lineHeight: "1.5",
        },
      ],
      "2xl": [
        "24px",
        {
          lineHeight: "1.5",
        },
      ],
      "3xl": [
        "30px",
        {
          lineHeight: "1.5",
        },
      ],
      "4xl": [
        "36px",
        {
          lineHeight: "1.5",
        },
      ],
      "5xl": [
        "48px",
        {
          lineHeight: "1.3",
        },
      ],
      "6xl": [
        "60px",
        {
          lineHeight: "1.5",
        },
      ],
      "7xl": [
        "72px",
        {
          lineHeight: "1.5",
        },
      ],
      "8xl": [
        "96px",
        {
          lineHeight: "1.5",
        },
      ],
      "9xl": [
        "128px",
        {
          lineHeight: "1.5",
        },
      ],
    },
  },
}
