<script lang="ts">
    import type { PageProps } from "./$types";
    import { resolve } from "$app/paths";

    let { data }: PageProps = $props();
</script>

{#if data.restaurants}
    <ul>
        {#each data.restaurants as restaurant (restaurant.id)}
            <li>
                <a href={resolve("/restaurants/{restaurant.restaurantCode}")}
                    >{restaurant.restaurantName}</a
                >
            </li>
        {/each}
    </ul>
{:else}
    <p>Couldnt load restaurants error: {data.error}</p>
{/if}
