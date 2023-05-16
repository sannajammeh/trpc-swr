import { cn } from "@/lib/utils";

interface UserProps extends React.HTMLAttributes<HTMLDivElement> {
	name: React.ReactNode;
	description?: React.ReactNode;
	src: string;
	squared?: boolean;
}

export const User = ({
	name,
	description,
	src,
	squared,
	...props
}: UserProps) => {
	return (
		<div className="flex items-center space-x-2" {...props}>
			<div className="flex-shrink-0">
				<img
					className={cn("h-10 w-10 rounded-full", squared && "rounded-md")}
					src={src}
					alt={`${name}'s avatar`}
				/>
			</div>
			<div>
				<div className="text-base font-medium">{name}</div>
				<div className="text-sm">{description}</div>
			</div>
		</div>
	);
};
