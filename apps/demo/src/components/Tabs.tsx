import { classed } from "@tw-classed/react";
import {
	Children,
	cloneElement,
	createContext,
	useContext,
	useState,
} from "react";

const TabsContext = createContext({
	activeTab: 0,
	setActiveTab: (tab: number) => {},
});

const Tabs = ({ children }: React.PropsWithChildren<{}>) => {
	const [activeTab, setActiveTab] = useState(0);
	const childrenArray = Children.toArray(children);
	const [list, ...rest] = childrenArray;
	return (
		<TabsContext.Provider value={{ activeTab, setActiveTab }}>
			<section className="flex flex-col rounded-t-md overflow-hidden">
				{list}
			</section>
			{rest[activeTab]}
		</TabsContext.Provider>
	);
};

const TabListContainer = classed.nav("flex");
const TabList = ({ children }: React.PropsWithChildren<{}>) => {
	// Clone children and pass the index as a prop
	return (
		<TabListContainer>
			{Children.map(children, (child, index) => {
				if (!child) return null;
				return <>{cloneElement(child as any, { tab: index })}</>;
			})}
		</TabListContainer>
	);
};

const TabItemContainer = classed.div(
	"w-max px-4 py-2 hover:bg-black/10 dark:hover:bg-gray-800 transition-all",
	{
		variants: {
			active: {
				// Border using box-shadow to avoid the border from being cut off
				true: "border-blue-300 bottom-only !border-b-2",
			},
		},
	},
);

const TabItem = ({
	children,
	tab: index,
}: React.PropsWithChildren<{ tab?: number }>) => {
	const { activeTab, setActiveTab } = useContext(TabsContext);
	return (
		<TabItemContainer
			role="button"
			active={activeTab === index}
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			onClick={() => setActiveTab(index!)}
		>
			{children}
		</TabItemContainer>
	);
};

const TabsContent = ({ children }: React.PropsWithChildren<{}>) => {
	return <>{children}</>;
};

Tabs.Content = TabsContent;
Tabs.List = TabList;
Tabs.Item = TabItem;

export { Tabs };
