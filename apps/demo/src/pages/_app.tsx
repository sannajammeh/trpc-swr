import Sidebar from "@/components/Sidebar";
import { api } from "@/lib/trpc";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
	const [client] = useState(() => api.createClient());

	return (
		<>
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
		</>
	);
}
