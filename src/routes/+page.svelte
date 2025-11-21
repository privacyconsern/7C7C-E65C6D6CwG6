<script lang="ts">
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
    import type { PageProps } from './$types';
    import Nav from '$lib/components/Nav.svelte'
    import { goto } from '$app/navigation';
    let { data, form }: PageProps = $props();

    let formMessage: { type: 'success' | 'error', text: string } | null = null;
    let restaurantCode = $state('');
    const handleSubmit: SubmitFunction = () => {
        console.log("init passed")
        formMessage = null;
        
        return async ({ result, update }) => {
            if (result.type === 'redirect') {
                goto(`/restaurants/${restaurantCode}`)
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
<Nav />
<form method="POST" action="?/checkCode" use:enhance={handleSubmit}>
        <label for="restaurant-code">Restaurant Code:</label>
        <input 
            type="text" 
            id="restaurant-code" 
            name="restaurantCode" 
            placeholder="Enter code here" 
            required
            bind:value={restaurantCode}
        />
        <button class="bg-[#2300B0] px-4 flex items-center justify-center" type="submit">
            <p class="text-white">➤</p>
        </button>
    </form>

    {#if formMessage}
        <p class={formMessage.type === 'error' ? 'error-message' : 'success-message'}>
            {formMessage.text}
        </p>
    {/if}
<!--
<input type="text" placeholder="Enter restaurant code" bind:value={restaurantCode}
        class="flex-grow-0.5 px-4 py-2 text-lg text-gray-700 placeholder-gray-500 focus:outline-none"/>
<button on:click={handleSubmit}
    class="bg-[#2300B0] px-4 flex items-center justify-center">
    <p class="text-white">➤</p>
</button>

<script lang="ts">
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
    let formMessage: { type: 'success' | 'error', text: string } | null = null;
    let restaurantCode = $state('');
    const handleSubmit: SubmitFunction = () => {
        formMessage = null;

        return async ({ result, update }) => {
            if (result.type === 'redirect') {
                return;
            }

            if (result.type === 'success' && result.data?.code) {
                // Should not happen if the redirect works, but good for debugging
                formMessage = { type: 'success', text: `Found restaurant: ${result.data.code}` };
            } else if (result.type === 'error' || result.data?.error) {
                // Display error message from the server action
                formMessage = { type: 'error', text: result.data?.error || 'An unexpected error occurred.' };
            }

            // Update the page without a full reload (optional)
            await update();
        };
    };
</script>

<div class="container">
    <h1>Find Your Restaurant</h1>

    <form method="POST" action="?/checkCode" use:enhance={handleSubmit}>
        <label for="restaurant-code">Restaurant Code:</label>
        <input 
            type="text" 
            id="restaurant-code" 
            name="restaurantCode" 
            placeholder="NY-000-00" 
            required
            bind:value={restaurantCode}
        />
        <button type="submit">Go</button>
    </form>

    {#if formMessage}
        <p class={formMessage.type === 'error' ? 'error-message' : 'success-message'}>
            {formMessage.text}
        </p>
    {/if}
</div>

<style>
    /* Add basic styling for clarity */
    .error-message { color: red; font-weight: bold; }
    .success-message { color: green; }
    .container { max-width: 400px; margin: 0 auto; padding: 20px; }
    input { width: 100%; padding: 10px; margin-bottom: 10px; box-sizing: border-box; }
    button { padding: 10px 20px; }
</style>-->