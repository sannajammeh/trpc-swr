import "../styles.css";
import { createSSG } from "../server/ssg";
import Providers from "./Providers";
import SWRConfig from "./SWRConfig";

const rsc = createSSG();

const getData = async () => {
  await rsc.user.byId.fetch({ id: 1 });

  return rsc.dehydrate();
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getData();
  return (
    <html>
      <head />
      <body>
        <Providers>
          <SWRConfig
            value={{
              fallback: data,
            }}
          >
            {children}
          </SWRConfig>
        </Providers>
      </body>
    </html>
  );
}

export const config = {
  runtime: "edge",
};
