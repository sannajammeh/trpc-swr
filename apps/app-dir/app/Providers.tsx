"use client";

import { Toaster } from "@/components/ui/toaster";
import { api } from "@/lib/trpc";
import { useState } from "react";

export default function Providers({ children }: React.PropsWithChildren<{}>) {
	const [client] = useState(() => api.createClient());
	return (
		<api.Provider client={client}>
			{children}
			<Toaster />
		</api.Provider>
	);
}
