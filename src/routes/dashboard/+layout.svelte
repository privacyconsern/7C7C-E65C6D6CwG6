<script lang="ts">
	import type { LayoutProps } from './$types';
	let { data, children }: LayoutProps = $props();
</script>
<main>
	<!-- +page.svelte is `@render`ed here -->
	{@render children()}
</main>