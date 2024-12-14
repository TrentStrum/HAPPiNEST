'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend
);

interface AnalyticsCardProps {
	title: string;
	value: string | number;
	change: number;
	data: number[];
}

export function AnalyticsCard({ title, value, change, data }: AnalyticsCardProps) {
	const chartData = {
		labels: Array.from({ length: data.length }, (_, i) => i + 1),
		datasets: [
			{
				data,
				borderColor: 'hsl(var(--primary))',
				tension: 0.4,
				fill: false,
			},
		],
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<div className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
					{change >= 0 ? '+' : ''}
					{change}% from last month
				</div>
				<div className="h-[80px] mt-4">
					<Line
						data={chartData}
						options={{
							responsive: true,
							plugins: { legend: { display: false } },
							scales: { x: { display: false }, y: { display: false } },
						}}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
