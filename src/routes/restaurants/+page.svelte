<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>
<ul>
	{#each data.restaurants as restaurant}
	<li><a href="/restaurants/{restaurant.restaurantCode}">{restaurant.restaurantName}</a></li>
	{/each}
</ul>