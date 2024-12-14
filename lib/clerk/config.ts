export const clerkConfig = {
	publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
	secretKey: process.env.CLERK_SECRET_KEY,
	signInUrl: '/auth/login',
	signUpUrl: '/auth/register',
	afterSignInUrl: '/dashboard',
	afterSignUpUrl: '/dashboard',
	userProfileUrl: '/settings/profile',
};
