<script lang="ts">
	import UserIcon from '@lucide/svelte/icons/users';
	import AnalyticsIcon from '@lucide/svelte/icons/chart-line';
	import NavMain from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';

	interface User {
		name?: string;
		email?: string;
	}

	let { user, ...restProps }: { user?: User } & ComponentProps<typeof Sidebar.Root> = $props();

	const data = $derived({
		user: {
			name: user?.name || m.loading(),
			email: user?.email || m.loading()
		},
		navMain: [
			{
				title: m.dashboard(),
				url: '/',
				icon: UserIcon,
				isActive: page.url.pathname === '/'
			},
			{
				title: m.analytics(),
				url: '/charts',
				icon: AnalyticsIcon,
				isActive: page.url.pathname === '/charts'
			}
		],
		navSecondary: [
			// {
			// 	title: 'Settings',
			// 	url: '#',
			// 	icon: SettingsIcon
			// }
		]
	});
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
					{#snippet child({ props })}
						<a href="/" {...props}>
							<span class="text-base font-semibold">Admin</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
</Sidebar.Root>
