import { classed, deriveClassed } from "@tw-classed/react";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
	return (
		<aside className="w-full py-8 p-4 h-full bg-[#010101] border-gradient right-only">
			<h2 className="font-medium text-2xl mb-4">TRPC-SWR Demo</h2>
			<nav className="gap-1 flex flex-col">
				<NavLink href="/">Fetching</NavLink>
				<NavLink href="/mutation">Mutations</NavLink>
				<NavLink href="/simple-mutation">Simple Mutation</NavLink>
			</nav>
		</aside>
	);
};

export default Sidebar;

const NavLinkA = classed(Link, {
	base: "block rounded-md px-3 py-2 text-sm font-medium hover:text-violet-300 hover:bg-gray-800 text-white",
	variants: {
		active: {
			true: "bg-gray-900 text-white",
		},
	},
});

const NavLink = deriveClassed<typeof NavLinkA>((props, ref) => {
	const router = useRouter();

	const isActive = router.pathname === props.href;
	return <NavLinkA {...props} ref={ref} active={isActive} />;
});
