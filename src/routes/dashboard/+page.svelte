<script lang="ts">
    import type { PageProps } from './$types';
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
    import { goto } from '$app/navigation';

    let { data, form }: PageProps = $props();
    let formMessage: { type: 'success' | 'error', text: string } | null = null;
    let restaurantName = $state('');
    let restaurantCode = $state('');
    const handleCreateRestaurant: SubmitFunction = () => {
        console.log("init passed")
        formMessage = null;
        
        return async ({ result, update }) => {
            if (result.type === 'redirect') {
                goto(`/restaurants/${restaurantName}`)
            }
            else {
                //display error message from the server action
                formMessage = { type: 'error', text: `An unexpected error occurred. ${result.data?.error}` };
                console.log(result.data?.error)
            }
            //page reload (optional)
            await update();
        };
    };
</script>
    {#each data.restaurant as restaurants}
		<p>{restaurants.restaurantName}, {restaurants.restaurantCode}</p>
	{/each}
    <form class="flex justify-start px-38" method="POST" action="?/createRestaurant" use:enhance={handleCreateRestaurant}>
        <label for="restaurant-name"></label>
        <input 
            type="text" 
            id="restaurant-name" 
            name="restaurantName" 
            placeholder="Name of your restaurant" 
            required
            bind:value={restaurantName}
        /><label for="restaurant-code"></label>
        <input 
            type="text" 
            id="restaurant-code" 
            name="restaurantCode" 
            placeholder="Automatic later" 
            required
            bind:value={restaurantCode}
        /><button class="bg-[#2300B0] px-4 flex items-center justify-center" type="submit">
            <p class="text-white">➤</p>
        </button>
    </form>