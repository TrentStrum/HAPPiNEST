import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export const MAINTENANCE_CONSTANTS = {
	priorityColors: {
		1: 'bg-green-500',
		2: 'bg-yellow-500',
		3: 'bg-red-500',
	},

	statusIcons: {
		open: AlertTriangle,
		in_progress: Clock,
		completed: CheckCircle,
		cancelled: Clock,
	},

	statusColors: {
		open: 'text-yellow-500',
		in_progress: 'text-blue-500',
		completed: 'text-green-500',
		cancelled: 'text-gray-500',
	},
} as const;
