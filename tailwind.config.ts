export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue,html}"],
  theme: {
    screens: {
      xs: "350px",
    },
    extend: {
      boxShadow: {
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
      },
      transitionDuration: {
        "200": "200ms",
      },
      transitionProperty: {
        border: "border-color",
        shadow: "box-shadow",
      },
      spacing: {
        "inline-start": "inline-start",
        "inline-end": "inline-end",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      colors: {
        primary: "hsl(var(--primary) / <alpha-value>)",
        "primary-foreground": "hsl(var(--primary-foreground) / <alpha-value>)",
        "primary-text": "hsl(var(--primary-text) / <alpha-value>)",
        zinc: {
          500: "hsl(var(--zinc-primary))",
        },
        slate: {
          500: "hsl(var(--slate-primary))",
        },
        stone: {
          500: "hsl(var(--stone-primary))",
        },
        gray: {
          500: "hsl(var(--gray-primary))",
        },
        neutral: {
          500: "hsl(var(--neutral-primary))",
        },
        red: {
          500: "hsl(var(--red-primary))",
        },
        rose: {
          500: "hsl(var(--rose-primary))",
        },
        orange: {
          500: "hsl(var(--orange-primary))",
        },
        green: {
          500: "hsl(var(--green-primary))",
        },
        blue: {
          500: "hsl(var(--blue-primary))",
        },
        yellow: {
          500: "hsl(var(--yellow-primary))",
        },
        violet: {
          500: "hsl(var(--violet-primary))",
        },
      },
    },
  },
};
