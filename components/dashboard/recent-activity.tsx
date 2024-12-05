import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activity = [
  {
    id: "1",
    type: "payment",
    title: "Rent Payment Received",
    description: "Unit 101 - $1,500",
    timestamp: "2 hours ago",
    user: {
      name: "John Doe",
      image: "https://i.pravatar.cc/150?u=1",
    },
  },
  {
    id: "2",
    type: "maintenance",
    title: "New Maintenance Request",
    description: "Plumbing issue in Unit 203",
    timestamp: "4 hours ago",
    user: {
      name: "Jane Smith",
      image: "https://i.pravatar.cc/150?u=2",
    },
  },
  {
    id: "3",
    type: "lease",
    title: "Lease Signed",
    description: "New tenant in Unit 305",
    timestamp: "1 day ago",
    user: {
      name: "Mike Johnson",
      image: "https://i.pravatar.cc/150?u=3",
    },
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activity.map((item) => (
        <div key={item.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.user.image} alt={item.user.name} />
            <AvatarFallback>
              {item.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div className="ml-auto font-medium text-sm text-muted-foreground">
            {item.timestamp}
          </div>
        </div>
      ))}
    </div>
  );
}