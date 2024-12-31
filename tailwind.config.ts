import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens:{
        'max-1663':{max:'1163px'},
        'max-ss':{max:'376px'},
        'max-s':{max:'969px'},
        'max-xs':{max:'767px'},
        'max-xxs':{max:'424px'}
      }
    },
  },
  plugins: [],
};
export default config;
