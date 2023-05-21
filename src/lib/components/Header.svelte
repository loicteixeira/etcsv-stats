<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	const currentPageClasses = 'underline underline-offset-2 decoration-primary-500';
</script>

<AppBar slotTrail="place-content-end" shadow="drop-shadow-lg">
	<strong class="h1 {$page.route.id === '/' && currentPageClasses}">
		<a href="/">Etsy Stats</a></strong
	>
	<svelte:fragment slot="trail">
		<nav class="flex-none">
			<ul class="font-medium flex gap-3">
				<li class="px-2 py-1 rounded-md {$page.route.id === '/files' && currentPageClasses}">
					<a href="/files">Files</a>
				</li>
				<li
					class="px-2 py-1 rounded-md
                    {$page.route.id === '/orders-details' && currentPageClasses}"
				>
					<a href="/orders-details">Orders Details</a>
				</li>
				<li
					class="px-2 py-1 rounded-md
                    {$page.route.id === '/order-items-stats' && currentPageClasses}"
				>
					<a href="/order-items-stats">Order Items Stats</a>
				</li>
				<li
					class="px-2 py-1 rounded-md
                    {$page.route.id === '/customers-stats' && currentPageClasses}"
				>
					<a href="/customers-stats">Customers Stats</a>
				</li>
			</ul>
		</nav>
	</svelte:fragment>
</AppBar>
