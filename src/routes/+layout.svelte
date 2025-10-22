<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { Snippet } from 'svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { layoutData } from './layout.remote';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';

	let { children }: { children: Snippet } = $props();

	let data = $derived(await layoutData());
</script>

<svelte:head>
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta name="apple-mobile-web-app-title" content="Tap-Print Admin" />
	<!-- Theme colors for light and dark modes -->
	<meta name="theme-color" content="#f5f5ff" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#0f0f1a" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#f5f5ff" />
</svelte:head>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
<ModeWatcher />
<Sidebar.Provider
	open={true}
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar user={data?.user || { name: 'Demo User', email: 'demo@example.com' }} />
	<Sidebar.Rail />
	<Sidebar.Inset>
		<Sidebar.Trigger />
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
