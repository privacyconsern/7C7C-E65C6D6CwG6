<script lang="ts">
    import { page } from "$app/state";
    import "../app.css";
    import Register from "$lib/components/ui/Register.svelte";
    import Search from "$lib/components/ui/Search.svelte";
    import { resolve } from "$app/paths";
    let isModalOpen = $state(false);
    let isSearchOpen = $state(false);
    let { children, data } = $props();
    import { invalidateAll } from "$app/navigation";
    import type { SubmitFunction } from "@sveltejs/kit";
    import { t, locale, locales } from "../i18n";

    const user = $state(data.locals.user);
    console.log(user);
    console.log("refreshed");

    const handleSubmit: SubmitFunction = () => {
        console.log("passed");
        return async ({ update }) => {
            //page reload (optional)
            await update();
            await invalidateAll();
        };
    };
</script>

<nav class="px-24 py-12 flex">
    <a href={resolve("/")} class="text-4xl font-poppins-bold">
        <span class="text-[#2300B0]">Reserve</span><span class="text-[#2E2E2E]"
            >.it</span
        >
    </a>
    <a
        href={resolve("/search")}
        class="font-poppins-semi-bold text-[#2300B0] text-xl ml-20 justify-between gap-4 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#2300B0] after:transition-all after:duration-100 hover:after:w-full"
        >{$t("nav.browse")}</a
    >
    <a href={resolve("/about")} class="ml-4 nav-link-black text-xl"
        >{$t("nav.about")}</a
    >

    <p class="ml-4">
        <select bind:value={$locale}>
            {#each locales as l}
                <option value={l}>{l}</option>
            {/each}
        </select>
    </p>
    <button
        onclick={() => (isSearchOpen = true)}
        class="ml-56 text-xl font-poppins-regular mr-20 px-4 py-2 border border-black rounded-full text-black font-medium hover:cursor-text"
    >
        <span class="mr-2 text-lg">🔍︎</span>
        <span>{$t("nav.search")}</span>
        <span class="text-[#2300B0] ml-35">ctrl + k</span>
    </button>
    {#if user}
        <span class="text-sm font-medium"
            ><a href={resolve("/dashboard")}>{user.email}</a></span
        >
        <img id="avatar" src={user.profilePictureUrl} alt="Avatar" />
        <a
            href={resolve("/logout")}
            class="text-xl font-poppins-semi-bold bg-red-600 text-white px-6 py-2 rounded-lg hover:rounded-none"
        >
            {$t("nav.logout")}
        </a>
    {:else}
        <button
            onclick={() => (isModalOpen = true)}
            class="text-xl font-poppins-regular px-6 py-2 border border-black rounded-lg text-black font-medium hover:bg-black hover:text-white transition hover:rounded-none hover:cursor-pointer"
        >
            {$t("nav.register")}
        </button>
        <a
            href={resolve("/login")}
            class="text-xl font-poppins-semi-bold bg-[#2300B0] text-white px-6 py-2 rounded-lg ml-4 hover:rounded-none"
        >
            {$t("nav.login")}
        </a>
    {/if}
</nav>
<Register bind:showModal={isModalOpen} />
<Search bind:showSearch={isSearchOpen} />

{@render children()}
<p>Currently at {page.url.pathname}</p>
{#if page.error}
    <span class="red">{page.error.message}</span>
{:else}
    <span class="small">All systems operational</span>
{/if}

<style>
    #avatar {
        border-radius: 50%;
        width: 64px;
        height: 64px;
        object-fit: cover;
    }
</style>
