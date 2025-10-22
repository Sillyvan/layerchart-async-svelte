<script lang="ts">
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { PieChart, Text } from 'layerchart';
	import SiteHeader from '$lib/components/site-header.svelte';
	import X from '@lucide/svelte/icons/x';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getData } from './data.remote';
	import { m } from '$lib/paraglide/messages.js';

	// Extract customer ID from search params
	const customerId = $derived(page.url.searchParams.get('customer') ?? undefined);

	// Use modern async derived pattern for data loading
	const data = $derived(await getData(customerId));

	// eslint-disable-next-line svelte/no-navigation-without-resolve
	function handleSegmentClick(_e: MouseEvent, details: { data?: { customerid?: string } }) {
		const customerId = details?.data?.customerid;
		if (customerId) {
			goto(`/?search=${encodeURIComponent(customerId)}`).catch(() => {});
		}
	}

	// eslint-disable-next-line svelte/no-navigation-without-resolve
	function removeFilter() {
		goto('/charts').catch(() => {});
	}

	const top5Total = $derived(
		data.pageViewsTotal.data.sort((a, b) => b.total_pageviews - a.total_pageviews).slice(0, 5)
	);
	const top5Month = $derived(
		data.pageViewsMonth.data.sort((a, b) => b.total_pageviews - a.total_pageviews).slice(0, 5)
	);
	const top5Today = $derived(
		data.pageViewsToday.data.sort((a, b) => b.total_pageviews - a.total_pageviews).slice(0, 5)
	);

	// Chart data for today's top 5
	const chartDataToday = $derived(
		top5Today.map((item, index) => ({
			customerid: item.customer_id,
			visitors: item.total_pageviews,
			fill: `var(--chart-${index + 1})`
		}))
	);

	// Chart data for this month's top 5
	const chartDataMonth = $derived(
		top5Month.map((item, index) => ({
			customerid: item.customer_id,
			visitors: item.total_pageviews,
			fill: `var(--chart-${index + 1})`
		}))
	);

	// Chart data for total (all time) top 5
	const chartDataTotal = $derived(
		top5Total.map((item, index) => ({
			customerid: item.customer_id,
			visitors: item.total_pageviews,
			fill: `var(--chart-${index + 1})`
		}))
	);

	// Chart config for today
	const chartConfigToday = $derived({
		visitors: { label: m.page_views() },
		customerid: { label: m.customer() },
		...Object.fromEntries(
			top5Today.map((item, index) => [
				item.customer_id,
				{
					color: `var(--chart-${index + 1})`,
					label: data.customerNames[item.customer_id] || m.deleted()
				}
			])
		)
	} satisfies Chart.ChartConfig);

	// Chart config for month
	const chartConfigMonth = $derived({
		visitors: { label: m.page_views() },
		customerid: { label: m.customer() },
		...Object.fromEntries(
			top5Month.map((item, index) => [
				item.customer_id,
				{
					color: `var(--chart-${index + 1})`,
					label: data.customerNames[item.customer_id] || m.deleted()
				}
			])
		)
	} satisfies Chart.ChartConfig);

	// Chart config for total
	const chartConfigTotal = $derived({
		visitors: { label: m.page_views() },
		customerid: { label: m.customer() },
		...Object.fromEntries(
			top5Total.map((item, index) => [
				item.customer_id,
				{
					color: `var(--chart-${index + 1})`,
					label: data.customerNames[item.customer_id] || m.deleted()
				}
			])
		)
	} satisfies Chart.ChartConfig);

	const totalVisitors = $derived(chartDataTotal.reduce((acc, curr) => acc + curr.visitors, 0));
	const monthVisitors = $derived(chartDataMonth.reduce((acc, curr) => acc + curr.visitors, 0));
	const todayVisitors = $derived(chartDataToday.reduce((acc, curr) => acc + curr.visitors, 0));
</script>

<SiteHeader title={m.analytics_dashboard()} />

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<div class="flex items-center justify-between px-4 md:px-6">
				<div>
					<h1 class="text-2xl font-bold">{m.analytics_dashboard()}</h1>
					<p class="text-muted-foreground">
						{data.customerId
							? m.showing_analytics_for({
									customerName: data.customerNames[data.customerId] || data.customerId
								})
							: m.customer_page_views_analytics()}
					</p>
					{#if data.customerId}
						<div class="mt-2">
							<Badge variant="secondary" class="gap-1">
								<span
									>{m.filtered_by({
										customerName: data.customerNames[data.customerId] || data.customerId
									})}</span
								>
								<button
									type="button"
									onclick={removeFilter}
									class="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
								>
									<X class="h-3 w-3" />
								</button>
							</Badge>
						</div>
					{/if}
				</div>
			</div>

			<div class="relative flex flex-1 flex-col gap-4 overflow-visible px-4 outline-none lg:px-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					<Card.Root class="flex flex-col">
						<Card.Header class="items-center">
							<Card.Title>{m.page_views()}</Card.Title>
							<Card.Description>{m.today()}</Card.Description>
						</Card.Header>
						<Card.Content class="flex-1">
							<Chart.Container
								config={chartConfigToday}
								class="mx-auto aspect-square max-h-[250px]"
							>
								<PieChart
									data={chartDataToday}
									key="customerid"
									value="visitors"
									c="fill"
									innerRadius={60}
									props={{ pie: { motion: 'tween' } }}
									onTooltipClick={handleSegmentClick}
								>
									{#snippet aboveMarks()}
										<Text
											value={String(todayVisitors)}
											textAnchor="middle"
											verticalAnchor="middle"
											class="fill-foreground text-3xl! font-bold"
											dy={3}
										/>
										<Text
											value={m.page_views()}
											textAnchor="middle"
											verticalAnchor="middle"
											class="fill-muted-foreground! text-muted-foreground"
											dy={22}
										/>
									{/snippet}
									{#snippet tooltip()}
										<Chart.Tooltip>
											{#snippet formatter({ value, item })}
												{@const customerId = item.payload?.customerid}
												{@const customerName = customerId
													? data.customerNames[customerId]
													: undefined}
												<div class="flex flex-col gap-1">
													<div class="font-medium">{customerName || m.deleted()}</div>
													{#if customerName && customerId !== customerName}
														<div class="text-xs text-muted-foreground">
															{m.id({ id: customerId })}
														</div>
													{:else if !customerName}
														<div class="text-xs text-muted-foreground">
															{m.id({ id: customerId })}
														</div>
													{/if}
													<div class="font-mono">
														{value?.toLocaleString()}
														{m.page_views()}
													</div>
												</div>
											{/snippet}
										</Chart.Tooltip>
									{/snippet}
								</PieChart>
							</Chart.Container>
						</Card.Content>
					</Card.Root>
					<Card.Root class="flex flex-col">
						<Card.Header class="items-center">
							<Card.Title>{m.page_views()}</Card.Title>
							<Card.Description>{m.this_month()}</Card.Description>
						</Card.Header>
						<Card.Content class="flex-1">
							<Chart.Container
								config={chartConfigMonth}
								class="mx-auto aspect-square max-h-[250px]"
							>
								<PieChart
									data={chartDataMonth}
									key="customerid"
									value="visitors"
									c="fill"
									innerRadius={60}
									props={{ pie: { motion: 'tween' } }}
									onTooltipClick={handleSegmentClick}
								>
									{#snippet aboveMarks()}
										<Text
											value={String(monthVisitors)}
											textAnchor="middle"
											verticalAnchor="middle"
											class="fill-foreground text-3xl! font-bold"
											dy={3}
										/>
										<Text
											value={m.page_views()}
											textAnchor="middle"
											verticalAnchor="middle"
											class="fill-muted-foreground! text-muted-foreground"
											dy={22}
										/>
									{/snippet}
									{#snippet tooltip()}
										<Chart.Tooltip>
											{#snippet formatter({ value, item })}
												{@const customerId = item.payload?.customerid}
												{@const customerName = customerId
													? data.customerNames[customerId]
													: undefined}
												<div class="flex flex-col gap-1">
													<div class="font-medium">{customerName || m.deleted()}</div>
													{#if customerName && customerId !== customerName}
														<div class="text-xs text-muted-foreground">
															{m.id({ id: customerId })}
														</div>
													{:else if !customerName}
														<div class="text-xs text-muted-foreground">
															{m.id({ id: customerId })}
														</div>
													{/if}
													<div class="font-mono">
														{value?.toLocaleString()}
														{m.page_views()}
													</div>
												</div>
											{/snippet}
										</Chart.Tooltip>
									{/snippet}
								</PieChart>
							</Chart.Container>
						</Card.Content>
					</Card.Root>
					<Card.Root class="flex flex-col">
						<Card.Header class="items-center">
							<Card.Title>{m.page_views()}</Card.Title>
							<Card.Description>{m.last_3_months()}</Card.Description>
						</Card.Header>
						<Card.Content class="flex-1">
							<Chart.Container
								config={chartConfigTotal}
								class="mx-auto aspect-square max-h-[250px]"
							>
								<PieChart
									data={chartDataTotal}
									key="customerid"
									value="visitors"
									c="fill"
									innerRadius={60}
									props={{ pie: { motion: 'tween' } }}
									onTooltipClick={handleSegmentClick}
								>
									{#snippet aboveMarks()}
										<Text
											value={String(totalVisitors)}
											textAnchor="middle"
											verticalAnchor="middle"
											class="fill-foreground text-3xl! font-bold"
											dy={3}
										/>
										<Text
											value={m.page_views()}
											textAnchor="middle"
											verticalAnchor="middle"
											class="fill-muted-foreground! text-muted-foreground"
											dy={22}
										/>
									{/snippet}
									{#snippet tooltip()}
										<Chart.Tooltip>
											{#snippet formatter({ value, item })}
												{@const customerId = item.payload?.customerid}
												{@const customerName = customerId
													? data.customerNames[customerId]
													: undefined}
												<div class="flex flex-col gap-1">
													<div class="font-medium">{customerName || m.deleted()}</div>
													{#if customerName && customerId !== customerName}
														<div class="text-xs text-muted-foreground">
															{m.id({ id: customerId })}
														</div>
													{:else if !customerName}
														<div class="text-xs text-muted-foreground">
															{m.id({ id: customerId })}
														</div>
													{/if}
													<div class="font-mono">
														{value?.toLocaleString()}
														{m.page_views()}
													</div>
												</div>
											{/snippet}
										</Chart.Tooltip>
									{/snippet}
								</PieChart>
							</Chart.Container>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</div>
	</div>
</div>
