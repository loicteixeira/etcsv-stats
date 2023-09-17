import { join } from 'path';
import type { Config } from 'tailwindcss';
import { skeleton } from '@skeletonlabs/tw-plugin';

const config = {
	darkMode: 'class', // Opt for dark mode to be handled via the class method
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
	],
	theme: {
		extend: {},
	},
	plugins: [
		// Append the Skeleton plugin (after other plugins)
		skeleton({
			themes: { preset: ['skeleton'] },
		}),
	],
} satisfies Config;

export default config;
