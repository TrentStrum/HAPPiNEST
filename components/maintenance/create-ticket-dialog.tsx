'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTenantUnits } from '@/hooks/react-query/use-tenants-units';
import { useCreateMaintenanceTicket } from '@/hooks/react-query/use-maintenance';
import { useUser } from '@clerk/nextjs';
import { 
	createTicketFormSchema, 
	defaultValues, 
	categories,
	CreateTicketFormValues 
} from '@/lib/schemas/maintenance';

interface CreateTicketDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateTicketDialog({ open, onOpenChange }: CreateTicketDialogProps) {
	const { user } = useUser();
	const [isLoading, setIsLoading] = useState(false);

	const { data: units } = useTenantUnits();

	const form = useForm<CreateTicketFormValues>({
		resolver: zodResolver(createTicketFormSchema),
		defaultValues: defaultValues as CreateTicketFormValues,
	});

	const mutation = useCreateMaintenanceTicket({
		onSuccess: () => {
			form.reset();
			onOpenChange(false);
		}
	});

	async function onSubmit(values: CreateTicketFormValues) {
		setIsLoading(true);
		await mutation.mutateAsync(values);
		setIsLoading(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Maintenance Ticket</DialogTitle>
					<DialogDescription>Submit a new maintenance request for your unit</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="unit_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Unit</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a unit" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{units?.map((lease) => (
												<SelectItem key={lease.unit.id} value={lease.unit.id}>
													{lease.unit.property.name} - Unit {lease.unit.unit_number}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Brief description of the issue" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Detailed description of the maintenance issue"
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories.map((category) => (
													<SelectItem key={category} value={category.toLowerCase()}>
														{category}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="priority"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Priority</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select priority" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="1">Low</SelectItem>
												<SelectItem value="2">Medium</SelectItem>
												<SelectItem value="3">High</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? 'Creating...' : 'Create Ticket'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
