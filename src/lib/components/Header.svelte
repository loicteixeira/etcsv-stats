<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	const currentPageClasses = 'underline underline-offset-2 decoration-primary-500';
</script>

<AppBar slotTrail="place-content-end" shadow="drop-shadow-lg">
	<strong class="h1 {$page.route.id === '/' && currentPageClasses}">
		<a href="/">EtCsv Stats</a></strong
	>
	<svelte:fragment slot="trail">
		<nav>
			<ul class="font-medium flex gap-6">
				<li class={$page.route.id === '/files' ? currentPageClasses : ''}>
					<a href="/files">Upload Files</a>
				</li>
				<li class={$page.route.id === '/orders' ? currentPageClasses : ''}>
					<a href="/orders">Orders</a>
				</li>
				<li class={$page.route.id === '/products' ? currentPageClasses : ''}>
					<a href="/products">Products</a>
				</li>
				<li class={$page.route.id === '/customers' ? currentPageClasses : ''}>
					<a href="/customers">Customers</a>
				</li>
			</ul>
		</nav>
	</svelte:fragment>
</AppBar>
