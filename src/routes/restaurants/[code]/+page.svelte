<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>
<ul>
	{#each data.tables as table}
	<p>{table.identification}</p>
	{/each}
</ul>