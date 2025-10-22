<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { getCustomers } from './customers.remote';
	import { m } from '$lib/paraglide/messages.js';

	const customers = $derived(await getCustomers());
</script>

<div class="container mx-auto p-6">
	<h1 class="mb-6 text-3xl font-bold">{m.analytics_dashboard()}</h1>

	<div class="mb-8">
		<a
			href="/charts"
			class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
		>
			{m.view_all_charts()}
		</a>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each customers as customer (customer.id)}
			<Card.Root class="flex flex-col">
				<Card.Header>
					<Card.Title>{customer.name}</Card.Title>
					<Card.Description>{m.customer_id({ id: customer.id })}</Card.Description>
				</Card.Header>
				<Card.Content class="flex-1">
					<a
						href="/charts?customer={customer.id}"
						class="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
					>
						{m.view_customer_analytics()}
					</a>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
