<script lang="ts">
    import { enhance } from "$app/forms";
    import type { SubmitFunction } from "@sveltejs/kit";
    import { goto } from "$app/navigation";
    import Slider from "$lib/components/ui/Slider.svelte";
    import { resolve } from "$app/paths";

    const imageUrl = "https://picsum.photos/800/400";
    let formMessage = $state<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    let resultStatus = $state<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    let restaurantCode = $state("");
    const handleSubmit: SubmitFunction = () => {
        console.log("init passed");
        formMessage = null;

        return async ({ result, update }) => {
            if (result.type === "redirect") {
                goto(resolve(`/restaurants/${restaurantCode}`));
            } else {
                //display error message from the server action
                formMessage = {
                    type: "error",
                    text: `An unexpected error occurred. ${result.data?.error}`,
                };
                console.log(result.data?.error);
            }
            //page reload (optional)
            await update();
        };
    };
</script>

<div class="inline-flex py-5">
    <div>
        <h1 class="text-6xl px-38 py-12">
            Reserve a table<br />at your favourite<br />restaurant
        </h1>
        <form
            class="flex justify-start px-38"
            method="POST"
            action="?/checkCode"
            use:enhance={handleSubmit}
        >
            <label for="restaurant-code"></label>
            <input
                type="text"
                id="restaurant-code"
                name="restaurantCode"
                placeholder="Enter restaurant code here"
                required
                class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#2300B0] focus:outline-none"
                bind:value={restaurantCode}
            /><button
                class="bg-[#2300B0] px-4 flex items-center justify-center"
                type="submit"
            >
                <p class="text-white">➤</p>
            </button>
        </form>
        <p class="text-sm text-gray-500 mt-2 px-38">
            Codes are in format ##-000-000
        </p>
        {#if formMessage}
            <p
                class={formMessage.type === "error"
                    ? "error-message"
                    : "success-message"}
            >
                {formMessage.text}
            </p>
        {/if}
        {#if resultStatus}
            <div
                class="mb-4 p-3 rounded text-sm {resultStatus.type === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'}"
            >
                {resultStatus.text}
            </div>
        {/if}
    </div>
    <div class="my-5">
        <img src={imageUrl} />
    </div>
</div>
<Slider />
<!--<RestaurantCards />-->
<div class="relative w-full h-128 bg-[#2300B0] flex justify-center gap-2">
    <div class="w-148 h-114 bg-white m-auto mt-5 ml-12">
        <img src="https://picsum.photos/800/500?random=1" />
        <h1 class="ml-2 mt-2">Restaurant Name</h1>
        <p class="ml-2 mt-1">
            Restaurant description, intended to kept short and sweet
        </p>
        <div class="flex justify-left gap-2">
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
    </div>
    <div class="w-148 h-114 bg-white m-auto mt-5">
        <img src="https://picsum.photos/800/500?random=2" />
        <h1 class="ml-2 mt-2">Restaurant Name</h1>
        <p class="ml-2 mt-1">
            Restaurant description, intended to kept short and sweet
        </p>
        <div class="flex justify-left gap-2">
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
    </div>
    <div class="w-148 h-114 bg-white m-auto mt-5 mr-12">
        <img src="https://picsum.photos/800/500?random=3" />
        <h1 class="ml-2 mt-2">Restaurant Name</h1>
        <p class="ml-2 mt-1">
            Restaurant description, intended to kept short and sweet
        </p>
        <div class="flex justify-left gap-2">
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
    </div>
</div>
<div class="bg-[#2300B0] h-10 justify-center flex">
    <button
        class="margin-auto w-40 border border-white text-white rounded-lg text-black font-medium hover:bg-white hover:text-[#2300B0] transition hover:rounded-none hover:cursor-pointer"
        >See more</button
    >
</div>
<div class="bg-[#2300B0] h-10"></div>

<div class="flex justify-center mt-30">
    <h1 class="text-6xl px-38 py-12">Are you a restauant owner?</h1>
</div>

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
