"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Star, ThumbsUp, Flag } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/reviews/review-card";
import { CreateReviewDialog } from "@/components/reviews/create-review-dialog";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PropertyReviewsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const params = useParams();
  const { user } = useAuth();

  const { data: property } = useQuery({
    queryKey: ["property", params.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          landlord:profiles!landlord_id (
            id,
            full_name,
            avg_rating
          )
        `)
        .eq("id", params.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ["property-reviews", params.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          reviewer:profiles!reviewer_id (
            id,
            full_name,
            avg_rating
          )
        `)
        .eq("property_id", params.id)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: userLease } = useQuery({
    queryKey: ["user-lease", params.id, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leases")
        .select("*")
        .eq("tenant_id", user?.id)
        .eq("unit_id", params.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const canReview = userLease && !reviews?.some(r => r.reviewer.id === user?.id);

  if (!property) return null;

  const ratings = [
    { label: "Maintenance", value: property.avg_maintenance_rating },
    { label: "Communication", value: property.avg_communication_rating },
    { label: "Condition", value: property.avg_condition_rating },
    { label: "Location", value: property.avg_location_rating },
    { label: "Value", value: property.avg_value_rating },
    { label: "Amenities", value: property.avg_amenities_rating },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews & Ratings</h1>
          <p className="text-muted-foreground">
            {property.name} - {property.total_reviews} reviews
          </p>
        </div>
        {canReview && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Write a Review
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overall Ratings</CardTitle>
            <CardDescription>
              Average ratings from {property.total_reviews} verified reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.label} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{rating.label}</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-lg font-semibold">
                      {rating.value?.toFixed(1) || "N/A"}
                    </span>
                    <Star className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About the Landlord</CardTitle>
            <CardDescription>
              {property.landlord.full_name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Rating</span>
                <div className="flex items-center">
                  <span className="mr-2 text-lg font-semibold">
                    {property.landlord.avg_rating?.toFixed(1) || "N/A"}
                  </span>
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Rate</span>
                <div className="flex items-center">
                  <span className="mr-2 text-lg font-semibold">95%</span>
                  <ThumbsUp className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Recent Reviews
        </h2>
        {reviews?.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <CreateReviewDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        propertyId={params.id as string}
        leaseId={userLease?.id}
      />
    </div>
  );
}