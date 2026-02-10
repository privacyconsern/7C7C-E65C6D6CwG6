<script lang="ts">
    import { page } from "$app/state";
    import "../app.css";
    import Modal from "$lib/components/ui/Modal.svelte";
    import { resolve } from "$app/paths";
    let isModalOpen = $state(false);
    let { children, data } = $props();
    import { invalidateAll } from "$app/navigation";
    import type { SubmitFunction } from "@sveltejs/kit";

    const user = $derived(data.locals.user);

    const handleSubmit: SubmitFunction = () => {
        console.log("passed");
        return async ({ update }) => {
            //page reload (optional)
            await update();
            await invalidateAll();
        };
    };
</script>

<nav class="px-24 py-12">
    <a href={resolve("/")} class="text-4xl font-poppins-bold">
        <span class="text-[#2300B0]">Reserve</span><span class="text-[#2E2E2E]"
            >.it</span
        >
    </a>
    <a
        href={resolve("/restaurants")}
        class="font-poppins-semi-bold text-[#2300B0] text-xl ml-20 justify-between gap-4 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#2300B0] after:transition-all after:duration-100 hover:after:w-full"
        >Explore restaurants</a
    >
    <a href={resolve("/about")} class="ml-4 nav-link-black text-xl">About</a>

    <button
        class="ml-56 text-xl font-poppins-regular mr-20 px-4 py-2 border border-black rounded-full text-black font-medium"
    >
        <span class="mr-2 text-lg">🔍︎</span>
        <span>search</span>
        <span class="text-[#2300B0] ml-35">ctrl + k</span>
    </button>
    {#if user}
        <div class="flex items-center gap-4 ml-auto">
            <span class="text-sm font-medium">Hello, {user.email}</span>
            <button
                onclick={logout}
                class="text-xl font-poppins-semi-bold bg-red-600 text-white px-6 py-2 rounded-lg hover:rounded-none"
            >
                Logout
            </button>
        </div>
    {:else}
        <button
            onclick={() => (isModalOpen = true)}
            class="text-xl font-poppins-regular px-6 py-2 border border-black rounded-lg text-black font-medium hover:bg-black hover:text-white transition hover:rounded-none hover:cursor-pointer"
        >
            Create an account
        </button>
        <a
            href={resolve("/login")}
            class="text-xl font-poppins-semi-bold bg-[#2300B0] text-white px-6 py-2 rounded-lg ml-4 hover:rounded-none"
        >
            Login
        </a>
    {/if}
</nav>
<Modal bind:showModal={isModalOpen} />

{@render children()}
<p>Currently at {page.url.pathname}</p>
{#if page.error}
    <span class="red">{page.error.message}</span>
{:else}
    <span class="small">All systems operational</span>
{/if}
