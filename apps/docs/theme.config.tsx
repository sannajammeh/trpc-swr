import { useRouter } from 'next/router';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span>tRPC SWR</span>,
  useNextSeoProps() {
    const { asPath } = useRouter();

    if (asPath !== '/') {
      return {
        titleTemplate: '%s - tRPC SWR',
      };
    }
  },
  project: {
    link: 'https://github.com/sannajammeh/trpc-swr',
  },
  docsRepositoryBase:
    'https://github.com/sannajammeh/trpc-swr/tree/main/apps/docs',
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <a href="https://trpc-swr.vercel.app" target="_blank">
          tRPC-SWR
        </a>
        .
      </span>
    ),
  },
  editLink: {
    text: 'Edit this page on GitHub',
  },
  banner: {
    text: 'trpc-swr is currently in release candidate mode - please report any issues you find',
  },
};

export default config;
