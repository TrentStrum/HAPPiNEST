"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle, Clock, User, Home, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UpdateTicketDialog } from "./update-ticket-dialog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/client";

interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    description: string;
    status: "open" | "in_progress" | "completed" | "cancelled";
    priority: number;
    category: string;
    created_at: string;
    images?: string[];
    unit: {
      unit_number: string;
      property: {
        name: string;
        address: string;
      };
    };
    tenant: {
      full_name: string;
      email: string;
    };
    technician?: {
      full_name: string;
      email: string;
    };
  };
}

const priorityColors = {
  1: "bg-green-500",
  2: "bg-yellow-500",
  3: "bg-red-500",
};

const statusIcons = {
  open: AlertTriangle,
  in_progress: Clock,
  completed: CheckCircle,
  cancelled: Clock,
};

const statusColors = {
  open: "text-yellow-500",
  in_progress: "text-blue-500",
  completed: "text-green-500",
  cancelled: "text-gray-500",
};

export function TicketCard({ ticket }: TicketCardProps) {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const StatusIcon = statusIcons[ticket.status];

  const updateMutation = useMutation({
    mutationFn: async (status: string) => {
      const { data, error } = await supabase
        .from("maintenance_tickets")
        .update({ status })
        .eq("id", ticket.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
    },
  });

  const handleStatusUpdate = async (status: string) => {
    await updateMutation.mutateAsync(status);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              priorityColors[ticket.priority as keyof typeof priorityColors]
            }`}
          />
          <CardTitle className="text-lg font-semibold">{ticket.title}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <StatusIcon className={`h-5 w-5 ${statusColors[ticket.status]}`} />
          <Badge variant="outline">{ticket.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{ticket.description}</p>

          {ticket.images && ticket.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {ticket.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Ticket image ${index + 1}`}
                  className="h-24 w-24 object-cover rounded-md"
                />
              ))}
            </div>
          )}

          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Home className="mr-2 h-4 w-4" />
              {ticket.unit.property.name} - Unit {ticket.unit.unit_number}
            </div>
            <div className="flex items-center text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
              Reported by: {ticket.tenant.full_name}
            </div>
            {ticket.technician && (
              <div className="flex items-center text-muted-foreground">
                <User className="mr-2 h-4 w-4" />
                Assigned to: {ticket.technician.full_name}
              </div>
            )}
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              Created: {format(new Date(ticket.created_at), "PPp")}
            </div>
          </div>

          {(user?.role === "landlord" || user?.role === "technician") && (
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUpdateDialogOpen(true)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Update
              </Button>
              {ticket.status === "open" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate("in_progress")}
                >
                  Start Work
                </Button>
              )}
              {ticket.status === "in_progress" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate("completed")}
                >
                  Mark Complete
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <UpdateTicketDialog
        ticket={ticket}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />
    </Card>
  );
}