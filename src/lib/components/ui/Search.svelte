<script lang="ts">
    import { enhance } from "$app/forms";
    import { redirect, type SubmitFunction } from "@sveltejs/kit";

    let { showSearch = $bindable(false) } = $props();

    let dialog: HTMLDialogElement | undefined = $state();
    let searchQuery = $state("");
    let resultStatus = $state<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    let generalErrors = $state("");
    let fieldErrors = $state("");

    $effect(() => {
        if (showSearch) {
            dialog?.showModal();
        } else {
            dialog?.close();
        }
    });

    const handleSubmit: SubmitFunction = () => {
        resultStatus = null;
        console.log("called");

        return async ({ result, update }) => {
            if (result.type === "success") {
                resultStatus = {
                    type: "success",
                    text: "Check inbox to confirm registration",
                };
                redirect(302, "/search");
            } else if (result.type === "failure") {
                // In SvelteKit, errors usually come back as 'failure'
                resultStatus = {
                    type: "error",
                    text:
                        (result.data as any)?.error ??
                        "An unexpected error occurred.",
                };
            }
            await update();
        };
    };
</script>

<dialog
    bind:this={dialog}
    onclick={() => (showSearch = false)}
    class="m-auto rounded-lg p-0 shadow-2xl backdrop:bg-black/60 overflow-hidden"
>
    <div class="relative block w-[90vw] max-w-md bg-white p-8">
        {#if resultStatus}
            <div
                class="mb-4 p-3 rounded text-sm {resultStatus.type === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'}"
            >
                {resultStatus.text}
            </div>
        {/if}
        <form
            novalidate
            method="POST"
            action="/search?/search"
            use:enhance={handleSubmit}
            class="flex"
        >
            <input
                name="searchQuery"
                placeholder="Search everything.."
                required
                class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#2300B0] focus:outline-none"
            />
            <button
                class="bg-[#2300B0] px-4 flex items-center justify-center"
                type="submit"
            >
                <p class="text-white">➤</p>
            </button>
        </form>

        {#if generalErrors || fieldErrors}
            <span>{generalErrors}, {fieldErrors}</span>
        {/if}
    </div>
</dialog>

<style>
    :global(body:has(dialog[open])) {
        overflow: hidden;
    }
</style>
