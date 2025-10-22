import { query } from '$app/server';

export const getCustomers = query(async () => {
	return [
		{ id: 'customer1', name: 'Acme Corp' },
		{ id: 'customer2', name: 'Tech Solutions' },
		{ id: 'customer3', name: 'Global Industries' },
		{ id: 'customer4', name: 'StartUp Inc' },
		{ id: 'customer5', name: 'Enterprise Ltd' },
		{ id: 'customer6', name: 'Digital Agency' },
		{ id: 'customer7', name: 'Cloud Services' }
	];
});
