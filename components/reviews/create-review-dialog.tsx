"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  content: z.string().min(10, "Review must be at least 10 characters"),
  maintenance_rating: z.string().min(1, "Please rate maintenance"),
  communication_rating: z.string().min(1, "Please rate communication"),
  condition_rating: z.string().min(1, "Please rate condition"),
  location_rating: z.string().min(1, "Please rate location"),
  value_rating: z.string().min(1, "Please rate value"),
  amenities_rating: z.string().min(1, "Please rate amenities"),
});

interface CreateReviewDialogProps {
  propertyId: string;
  leaseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateReviewDialog({
  propertyId,
  leaseId,
  open,
  onOpenChange,
}: CreateReviewDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      maintenance_rating: "",
      communication_rating: "",
      condition_rating: "",
      location_rating: "",
      value_rating: "",
      amenities_rating: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data, error } = await supabase.from("reviews").insert([
        {
          type: "property_review",
          reviewer_id: user?.id,
          property_id: propertyId,
          lease_id: leaseId,
          content: values.content,
          maintenance_rating: parseInt(values.maintenance_rating),
          communication_rating: parseInt(values.communication_rating),
          condition_rating: parseInt(values.condition_rating),
          location_rating: parseInt(values.location_rating),
          value_rating: parseInt(values.value_rating),
          amenities_rating: parseInt(values.amenities_rating),
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-reviews", propertyId] });
      toast({
        title: "Success",
        description: "Your review has been submitted for approval",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await mutation.mutateAsync(values);
    setIsLoading(false);
  }

  const ratingOptions = [
    { value: "1", label: "1 - Poor" },
    { value: "2", label: "2 - Fair" },
    { value: "3", label: "3 - Good" },
    { value: "4", label: "4 - Very Good" },
    { value: "5", label: "5 - Excellent" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with this property. Your review will be visible
            after approval.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience with this property..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "maintenance_rating", label: "Maintenance" },
                { name: "communication_rating", label: "Communication" },
                { name: "condition_rating", label: "Property Condition" },
                { name: "location_rating", label: "Location" },
                { name: "value_rating", label: "Value for Money" },
                { name: "amenities_rating", label: "Amenities" },
              ].map((rating) => (
                <FormField
                  key={rating.name}
                  control={form.control}
                  name={rating.name as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{rating.label}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Rate ${rating.label}`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ratingOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}