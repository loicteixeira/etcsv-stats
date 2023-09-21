<script lang="ts">
	import Icon from '@iconify/svelte';
	import alert16 from '@iconify/icons-tabler/alert-circle';
</script>

<div class="flex flex-col gap-6 mt-12 max-w-prose mx-auto">
	<h1 class="h1">EtCsv Stats</h1>

	<p>
		EtCsv Stats is an
		<a href="https://github.com/loicteixeira/etcsv-stats" class="anchor">open-source tool</a>
		designed to help you make sense of your sales on Etsy. You can review associated fees and taxes on
		any order, understand how many products sold, see your actual net income after fees and taxes, and
		see who your top customers are by number of orders and total spend.
	</p>
	<div class="relative rounded-xl bg-surface-700 p-4 pr-16">
		<div class="flex items-start space-x-2.5">
			<Icon icon={alert16} class="text-warning-500 text-3xl shrink-0" />

			<div class="mt-1 text-text">
				<div class="font-semibold mb-2">
					EtCsv Stats is NOT affiliated with, nor endorsed by, Etsy, Inc.
				</div>

				EtCsv Stats is an open source tool made by an independent programmer to help indie sellers
				make sense of their commercial activity on Etsy.
			</div>
		</div>
	</div>
	<div class="relative rounded-xl bg-surface-700 p-4 pr-16">
		<div class="flex items-start space-x-2.5">
			<Icon icon={alert16} class="text-warning-500 text-3xl shrink-0" />

			<div class="mt-1 text-text">
				<div class="font-semibold mb-2">EtCsv Stats is NOT an accounting software!</div>

				EtCsv stats will generate views based on files you upload from Etsy;<br />
				However, it cannot be guaranteed that these numbers are 100% accurate. In cases where your shop
				is based internationally, your listing fees may fluctuate based on your local currency’s conversion
				rate to USD, and EtCsv Stats does not account for these fluctuations.<br />
				Additionally, Etsy themselves may change their fees mid-year, which this tool may not have updated
				for at the time you use it. There may also be differences in how sums are rounded. EtCsv Stats
				is not liable for your use of the data displays generated from your uploaded files.
			</div>
		</div>
	</div>
	<h2 class="h2">How does it work?</h2>
	<p>
		You will download files provided by Etsy for your Etsy shop, then
		<a href="/files" class="anchor">upload them</a>
		into EtCsv Stats. EtCsv Stats will then generate different views for this data to help you better
		understand your fees, your top-selling products, and your top-buying customers. Refer to the guide
		on the upload page to learn which files you need from EtCsv and how to download them.
	</p>
	<h2 class="h2">Why should I use EtCsv Stats?</h2>
	<p>Here’s some things that EtCsv Stats is ideal for:</p>

	<ul>
		<li class="flex items-start gap-3">
			<span>✅</span> Seeing how much in Etsy fees and associated taxes on fees is actually taken out
			of each order
		</li>
		<li class="flex items-start gap-3">
			<span>✅</span> Seeing which are my top-selling products, and how many units of each product I
			sold
		</li>
		<li class="flex items-start gap-3">
			<span>✅</span> Seeing my net income on my products after EtCsv fees and associated taxes on fees
			are accounted for
		</li>
		<li class="flex items-start gap-3">
			<span>✅</span> Seeing which customers placed the most orders
		</li>
		<li class="flex items-start gap-3">
			<span>✅</span>Seeing which customers had the highest spend based on net income after Etsy
			fees and associated taxes on fees
		</li>
	</ul>

	<p>Here’s some things that EtCsv Stats is not ideal for:</p>

	<ul>
		<li class="flex items-start gap-3"><span>❌</span> Using it as accounting software</li>

		<li class="flex items-start gap-3">
			<span>❌</span> Using it to accurately calculate and report my income for my taxes
		</li>
	</ul>

	<h2 class="h2">Which shops can use EtCsv Stats?</h2>
	<p>
		EtCsv stats is currently optimized for shops based in 🇫🇷 France. If you know that your shop has
		the same
		<a
			href="https://help.etsy.com/hc/en-us/articles/1500011073202-What-is-a-Regulatory-Operating-Fee-"
			class="anchor">Regulatory Operating Fees</a
		>
		,
		<a href="https://help.etsy.com/hc/en-us/articles/115015628847" class="anchor">
			Payment Processing Fees
		</a>
		, and
		<a
			href="https://help.etsy.com/hc/en-us/articles/360000344908-Fees-and-Listing-Multiple-Quantities"
			class="anchor"
		>
			Listing Fees
		</a>
		as Etsy shops based in France, then EtCsv Stats should display your data similarly.
	</p>
	<h2 class="h2">Is my data safe?</h2>
	<p>
		EtCsv Stats does not save your uploaded files to any server;<br />
		However, the data in your uploaded files will be scanned during your user session.
	</p>
	<p>
		Your personal data is never collected or used in any way while using EtCsv Stats. You don’t need
		to create an account or log in to use it.
	</p>
</div>
