<script lang="ts">
	interface Props {
		title: string;
	}

	let { title }: Props = $props();
</script>

<header class="border-b">
	<div class="container flex h-16 items-center px-4">
		<h1 class="text-lg font-semibold">{title}</h1>
	</div>
</header>
