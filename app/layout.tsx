import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { QueryProvider } from '@/components/providers/query-provider';
import Navigation from '@/components/layout/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'HappyNest - Modern Property Management Made Simple',
	description:
		'The all-in-one platform for landlords and tenants to manage properties, collect rent, and handle maintenance requests.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<body className={inter.className}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<QueryProvider>
							<Navigation />
							<main className="container mx-auto px-4 py-8">{children}</main>
							<Toaster />
						</QueryProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
