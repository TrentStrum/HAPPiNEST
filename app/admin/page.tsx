import { AnalyticsCard } from '@/components/admin/analytics-card';
import { SubscriptionsTable } from '@/components/admin/subscriptions-table';
import { RevenueChart } from '@/components/admin/revenue-chart';

export default async function AdminDashboard() {
	// Fetch analytics data here
	const analytics = {
		totalUsers: 1250,
		activeSubscriptions: 850,
		monthlyRevenue: 42500,
		churnRate: 2.3,
	};

	return (
		<div className="space-y-8">
			<h1 className="text-3xl font-bold">Admin Dashboard</h1>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<AnalyticsCard
					title="Total Users"
					value={analytics.totalUsers}
					change={12.5}
					data={[23, 45, 67, 89, 100, 120, 140]}
				/>
				<AnalyticsCard
					title="Active Subscriptions"
					value={analytics.activeSubscriptions}
					change={8.2}
					data={[45, 56, 78, 89, 95, 110, 115]}
				/>
				<AnalyticsCard
					title="Monthly Revenue"
					value={`$${analytics.monthlyRevenue.toLocaleString()}`}
					change={15.3}
					data={[34000, 37000, 39000, 41000, 42500]}
				/>
				<AnalyticsCard
					title="Churn Rate"
					value={`${analytics.churnRate}%`}
					change={-0.8}
					data={[3.1, 2.9, 2.7, 2.5, 2.3]}
				/>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<RevenueChart />
				<SubscriptionsTable />
			</div>
		</div>
	);
}
