<script lang="ts">
    import { page } from '$app/state';
	import '../app.css';
	let { children } = $props();
</script>
{@render children()}
<p>Currently at {page.url.pathname}</p>
{#if page.error}
	<span class="red">{page.error.message}</span>
{:else}
	<span class="small">All systems operational</span>
{/if}