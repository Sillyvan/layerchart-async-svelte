import { query } from '$app/server';
import * as v from 'valibot';

interface CustomerNames {
	[key: string]: string;
	customer1: string;
	customer2: string;
	customer3: string;
	customer4: string;
	customer5: string;
	customer6: string;
	customer7: string;
}

interface PageViewData {
	customer_id: string;
	total_pageviews: number;
}

export const getData = query(v.optional(v.string()), async (customerId) => {
	const customerNames: CustomerNames = {
		customer1: 'Acme Corp',
		customer2: 'Tech Solutions',
		customer3: 'Global Industries',
		customer4: 'StartUp Inc',
		customer5: 'Enterprise Ltd',
		customer6: 'Digital Agency',
		customer7: 'Cloud Services'
	};

	let pageViewsToday: PageViewData[] = [
		{ customer_id: 'customer1', total_pageviews: 150 },
		{ customer_id: 'customer2', total_pageviews: 280 },
		{ customer_id: 'customer3', total_pageviews: 120 },
		{ customer_id: 'customer4', total_pageviews: 200 },
		{ customer_id: 'customer5', total_pageviews: 180 }
	];

	let pageViewsMonth: PageViewData[] = [
		{ customer_id: 'customer1', total_pageviews: 3200 },
		{ customer_id: 'customer2', total_pageviews: 4500 },
		{ customer_id: 'customer3', total_pageviews: 2800 },
		{ customer_id: 'customer4', total_pageviews: 3900 },
		{ customer_id: 'customer5', total_pageviews: 3100 }
	];

	let pageViewsTotal: PageViewData[] = [
		{ customer_id: 'customer1', total_pageviews: 12000 },
		{ customer_id: 'customer2', total_pageviews: 18000 },
		{ customer_id: 'customer3', total_pageviews: 9500 },
		{ customer_id: 'customer4', total_pageviews: 15000 },
		{ customer_id: 'customer5', total_pageviews: 11000 },
		{ customer_id: 'customer6', total_pageviews: 8000 },
		{ customer_id: 'customer7', total_pageviews: 6500 }
	];

	if (customerId) {
		const filterByCustomer = (data: typeof pageViewsTotal) =>
			data.filter((item) => item.customer_id === customerId);

		pageViewsToday = filterByCustomer(pageViewsToday);
		pageViewsMonth = filterByCustomer(pageViewsMonth);
		pageViewsTotal = filterByCustomer(pageViewsTotal);
	}

	await new Promise((r) => setTimeout(r, 500));

	return {
		customerId,
		customerNames: customerNames as CustomerNames,
		pageViewsToday: { data: pageViewsToday },
		pageViewsMonth: { data: pageViewsMonth },
		pageViewsTotal: { data: pageViewsTotal }
	};
});
