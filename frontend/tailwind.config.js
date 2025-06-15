/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      textColor: {
        skin: {
          base: 'hsl(var(--foreground))',
          primary: 'hsl(var(--primary))',
          secondary: 'hsl(var(--secondary))',
          muted: 'hsl(var(--muted))',
          accent: 'hsl(var(--accent))',
          destructive: 'hsl(var(--destructive))',
        },
      },
      backgroundColor: {
        skin: {
          base: 'hsl(var(--background))',
          primary: 'hsl(var(--primary))',
          secondary: 'hsl(var(--secondary))',
          muted: 'hsl(var(--muted))',
          accent: 'hsl(var(--accent))',
          destructive: 'hsl(var(--destructive))',
        },
      },
      borderColor: {
        skin: {
          base: 'hsl(var(--border))',
          primary: 'hsl(var(--primary))',
          secondary: 'hsl(var(--secondary))',
          muted: 'hsl(var(--muted))',
          accent: 'hsl(var(--accent))',
          destructive: 'hsl(var(--destructive))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
