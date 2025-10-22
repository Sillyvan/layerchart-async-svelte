import { query } from '$app/server';

export const layoutData = query(async () => {
	await new Promise((r) => setTimeout(r, 500));
	return {
		user: {
			name: 'Demo User',
			email: 'demo@example.com'
		}
	};
});
