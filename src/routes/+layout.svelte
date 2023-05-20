<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	const currentPageClasses = 'underline underline-offset-2 decoration-primary-500';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar slotTrail="place-content-end">
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
	</svelte:fragment>
	<div class="container h-full mx-auto py-6">
		<slot />
	</div>
</AppShell>
