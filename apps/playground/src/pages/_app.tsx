import { AppProps } from "next/dist/shared/lib/router/router";
import "../styles.css";
import { trpc } from "../utils/trpc";

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(App);
