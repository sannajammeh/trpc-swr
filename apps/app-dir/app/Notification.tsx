type INotification = {
	id: number;
	title: string;
	body: string;
	createdAt: Date;
};

const Notification = ({ notification }: { notification: INotification }) => {
	return (
		<div
			data-testid={`notification-${notification.id}`}
			key={notification.id}
			className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
		>
			<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
			<div className="space-y-1">
				<p className="text-sm font-medium leading-none">{notification.title}</p>
				<p className="text-sm text-muted-foreground">{notification.body}</p>
			</div>
		</div>
	);
};

export default Notification;
