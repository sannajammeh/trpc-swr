import { useRouter } from "next/router";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>tRPC SWR</span>,
  useNextSeoProps() {
    const { asPath } = useRouter();

    if (asPath !== "/") {
      return {
        openGraph: {
          type: "website",
          locale: "en_US",
          url: "https://trpc-swr.vercel.app",
          site_name: "tRPC SWR",
          images: [
            {
              url: "https://trpc-swr.vercel.app/social.png",
              alt: "tRPC SWR",
            },
          ],
        },
        titleTemplate: "%s - tRPC SWR",
      };
    }
  },
  head: () => (
    <>
      <link rel="shortcut icon" type="image/x-icon" href="/icon.png" />
    </>
  ),
  project: {
    link: "https://github.com/sannajammeh/trpc-swr",
  },
  docsRepositoryBase:
    "https://github.com/sannajammeh/trpc-swr/tree/main/apps/docs",
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{" "}
        <a href="https://trpc-swr.vercel.app" target="_blank" rel="noreferrer">
          tRPC-SWR
        </a>
        .
      </span>
    ),
  },
  editLink: {
    text: "Edit this page on GitHub",
  },
};

export default config;
