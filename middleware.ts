import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
	'/',
	'/features/landlords(.*)',
	'/features/tenants(.*)',
	'/auth/sign-in(.*)',
	'/auth/sign-up(.*)',
	'/api/webhooks/clerk(.*)',
	'/api/webhooks/stripe(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
	if (isPublicRoute(req)) return;
	await auth.protect();
});

export const config = {
	matcher: [
		"/((?!.+\\.[\\w]+$|_next).*)",
		"/",
		"/(api|trpc)(.*)"
	]
};