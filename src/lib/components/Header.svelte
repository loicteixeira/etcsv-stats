<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	const currentPageClasses = 'underline underline-offset-2 decoration-primary-500';
	const menuLinks = [
		{ path: '/files', text: 'Upload Files' },
		{ path: '/orders', text: 'Orders' },
		{ path: '/products', text: 'Products' },
		{ path: '/customers', text: 'Customers' },
	];
</script>

<AppBar
	gridColumns="grid-cols-1 md:grid-cols-[1fr_auto]"
	slotTrail="place-content-start md:place-content-end"
	shadow="drop-shadow-lg"
>
	<strong class="h2 {$page.route.id === '/' ? currentPageClasses : ''}">
		<a href="/">EtCsv Stats</a>
	</strong>
	<svelte:fragment slot="trail">
		<nav>
			<ul class="font-medium flex flex-col md:flex-row gap-3 md:gap-6">
				{#each menuLinks as { path, text } (path)}
					<li class={$page.route.id === path ? currentPageClasses : ''}>
						<a href={path}>{text}</a>
					</li>
				{/each}
			</ul>
		</nav>
	</svelte:fragment>
</AppBar>
