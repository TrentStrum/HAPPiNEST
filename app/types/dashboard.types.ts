export interface OverviewStats {
  totalProperties: number;
  totalUnits: number;
  occupancyRate: number;
  monthlyRevenue: number;
  recentActivity: Array<{
    id: string;
    type: 'payment' | 'maintenance' | 'lease';
    title: string;
    description: string;
    timestamp: string;
    user: {
      name: string;
      image?: string;
    };
  }>;
} 