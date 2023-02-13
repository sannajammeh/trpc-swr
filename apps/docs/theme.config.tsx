import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>TRPC SWR</span>,
  project: {
    link: "https://github.com/sachinraja/trpc-swr",
  },

  docsRepositoryBase: "https://github.com/sachinraja/trpc-swr",
  footer: {
    text: "TRPC-SWR",
  },
  banner: {
    text: "trpc-swr is currently in release candidate mode - please report any issues you find",
  },
};

export default config;
