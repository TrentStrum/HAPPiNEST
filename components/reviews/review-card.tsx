import { useState } from "react";
import { format } from "date-fns";
import { Star, Flag, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ReportReviewDialog } from "./report-review-dialog";
import { useAuth } from "@/hooks/use-auth";

interface ReviewCardProps {
  review: {
    id: string;
    content: string;
    created_at: string;
    maintenance_rating?: number;
    communication_rating?: number;
    condition_rating?: number;
    location_rating?: number;
    value_rating?: number;
    amenities_rating?: number;
    images?: string[];
    response?: string;
    response_date?: string;
    reviewer: {
      id: string;
      full_name: string;
      avg_rating: number;
    };
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { user } = useAuth();

  const ratings = [
    { label: "Maintenance", value: review.maintenance_rating },
    { label: "Communication", value: review.communication_rating },
    { label: "Condition", value: review.condition_rating },
    { label: "Location", value: review.location_rating },
    { label: "Value", value: review.value_rating },
    { label: "Amenities", value: review.amenities_rating },
  ].filter((rating) => rating.value);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.reviewer.full_name}`}
              alt={review.reviewer.full_name}
            />
            <AvatarFallback>
              {review.reviewer.full_name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{review.reviewer.full_name}</CardTitle>
            <CardDescription>
              {format(new Date(review.created_at), "PPP")}
            </CardDescription>
          </div>
        </div>
        {user && user.id !== review.reviewer.id && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsReportDialogOpen(true)}
          >
            <Flag className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ratings.map((rating) => (
            <div key={rating.label} className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">{rating.label}</span>
              <span className="text-sm text-muted-foreground">
                {rating.value}
              </span>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground">{review.content}</p>

        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto py-2">
            {review.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                className="h-24 w-24 object-cover rounded-md"
              />
            ))}
          </div>
        )}
      </CardContent>

      {review.response && (
        <CardFooter className="flex flex-col items-start border-t pt-6">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline">Landlord Response</Badge>
            <span className="text-sm text-muted-foreground">
              {format(new Date(review.response_date!), "PPP")}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{review.response}</p>
        </CardFooter>
      )}

      <ReportReviewDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        reviewId={review.id}
      />
    </Card>
  );
}