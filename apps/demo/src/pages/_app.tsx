import Sidebar from "@/components/Sidebar";
import { api } from "@/lib/trpc";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { createTheme } from "@nextui-org/react";
import Head from "next/head";

const darkTheme = createTheme({
	type: "dark",
	theme: {
		colors: {
			secondary: "#333",
		},
	},
});

export default function App({ Component, pageProps }: AppProps) {
	const [client] = useState(() => api.createClient());

	return (
		<NextUIProvider theme={darkTheme}>
			<Head>
				<title>TRPC-SWR Demo</title>
			</Head>
			<api.Provider client={client}>
				<div className="grid grid-cols-[1fr,_4fr] h-screen">
					<Sidebar />
					<main className="overflow-y-auto min-h-full p-16 px-32">
						<Component {...pageProps} />
					</main>
				</div>
			</api.Provider>
		</NextUIProvider>
	);
}
