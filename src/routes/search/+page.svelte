<script lang="ts">
    import type { PageProps } from "./$types";
    import { resolve } from "$app/paths";
    let { data }: PageProps = $props();
</script>

<div class="bg-[#2300B0] flex h-500">
    <div class="w-84 bg-red-600">
        <div>
            <h2>Filters</h2>
        </div>
    </div>
    {#if data.restaurants}
        <div
            class="relative w-full h-128 grid grid-cols-3 justify-center gap-2 hover:cursor-pointer"
        >
            {#each data.restaurants as restaurant (restaurant.id)}
                <div class="w-104 h-114 bg-white m-auto mt-5">
                    <a href={resolve("/restaurants")} style="all: unset;">
                        <img src="https://picsum.photos/800/500?random=1" />
                        <h1 class="ml-2 mt-2">{restaurant.restaurantName}</h1>
                        <p class="ml-2 mt-1">
                            {restaurant.description}
                        </p>
                        <div class="flex justify-left gap-2"></div></a
                    >
                    <button
                        class="mt-4 ml-3 p-2 border border-black rounded-lg text-black font-medium hover:bg-black hover:text-white transition hover:rounded-none hover:cursor-pointer"
                        >Menu</button
                    >
                    <p class="mt-5.5 ml-10">10:00 - 23:00</p>
                    <p class="mt-5.5 ml-10">150 - 300 Kč</p>
                    <button
                        class="mt-4 ml-18 p-2 border border-black rounded-lg text-black font-medium hover:bg-black hover:text-white transition hover:rounded-none hover:cursor-pointer"
                        >Reserve</button
                    >
                </div>
            {/each}
        </div>
    {:else}
        <p class="text-white">Couldnt load restaurants error: {data.error}</p>
    {/if}
</div>
