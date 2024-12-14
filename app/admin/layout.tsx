import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const user = await currentUser();

	// Check if user exists and is admin
	if (!user || user.publicMetadata.role !== 'admin') {
		redirect('/dashboard');
	}

	return (
		<div className="flex h-screen">
			<div className="w-64 border-r bg-muted p-4">
				{/* Temporary sidebar until we create the component */}
				<nav className="space-y-2">
					<div className="px-2 py-2">Dashboard</div>
				</nav>
			</div>
			<main className="flex-1 overflow-y-auto p-8">{children}</main>
		</div>
	);
}
