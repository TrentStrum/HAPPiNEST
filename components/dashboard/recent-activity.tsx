import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRecentActivity } from "@/hooks/react-query/use-properties";
import { OverviewStats } from "@/app/types/dashboard.types";

export function RecentActivity() {
  const { data: activity, isLoading } = useRecentActivity();

  if (isLoading) return <div>Loading...</div>;
  if (!activity) return null;

  return (
    <div className="space-y-8">
      {activity.map((item: OverviewStats['recentActivity'][number]) => (
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