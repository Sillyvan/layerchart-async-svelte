<script lang="ts">
	import DotsVerticalIcon from '@lucide/svelte/icons/ellipsis-vertical';
	import LogoutIcon from '@lucide/svelte/icons/log-out';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import ComputerIcon from '@lucide/svelte/icons/monitor';
	import CheckIcon from '@lucide/svelte/icons/check';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { goto } from '$app/navigation';
	import { userPrefersMode, setMode } from 'mode-watcher';
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages';

	let { user }: { user: { name: string; email: string } } = $props();

	const currentLocale = $derived(getLocale());

	const languageLabels = {
		en: () => m.language_english(),
		de: () => m.language_german()
	} as const;

	const sidebar = Sidebar.useSidebar();

	// eslint-disable-next-line svelte/no-navigation-without-resolve
	async function logout() {
		await goto('/');
	}
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs text-muted-foreground">
								{user.email}
							</span>
						</div>
						<DotsVerticalIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs text-muted-foreground">
								{user.email}
							</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="flex items-center gap-2">
						{#if userPrefersMode.current === 'light'}
							<SunIcon class="size-4" />
						{:else if userPrefersMode.current === 'dark'}
							<MoonIcon class="size-4" />
						{:else}
							<ComputerIcon class="size-4" />
						{/if}
						{m.theme()}
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item onclick={() => setMode('light')} class="flex items-center gap-2">
							<SunIcon class="size-4" />
							{m.light()}
							{#if userPrefersMode.current === 'light'}
								<CheckIcon class="ml-auto size-4" />
							{/if}
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => setMode('dark')} class="flex items-center gap-2">
							<MoonIcon class="size-4" />
							{m.dark()}
							{#if userPrefersMode.current === 'dark'}
								<CheckIcon class="ml-auto size-4" />
							{/if}
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => setMode('system')} class="flex items-center gap-2">
							<ComputerIcon class="size-4" />
							{m.system()}
							{#if userPrefersMode.current === 'system'}
								<CheckIcon class="ml-auto size-4" />
							{/if}
						</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Separator />
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="flex items-center gap-2">
						<GlobeIcon class="size-4" />
						{m.navigation_language()}
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						{#each locales as locale (locale)}
							<DropdownMenu.Item onclick={() => setLocale(locale)} class="flex items-center gap-2">
								<span class="min-w-6">
									{locale === 'en' ? '🇺🇸' : ''}
									{locale === 'de' ? '🇩🇪' : ''}
								</span>
								{languageLabels[locale]()}
								{#if currentLocale === locale}
									<CheckIcon class="ml-auto size-4" />
								{/if}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Separator />

				<DropdownMenu.Item onclick={logout}>
					<LogoutIcon />
					{m.log_out()}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
