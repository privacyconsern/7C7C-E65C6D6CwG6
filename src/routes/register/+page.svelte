<script lang="ts">
    import { enhance } from "$app/forms";
    import type { SubmitFunction } from "@sveltejs/kit";
    import type { PageProps } from "./$types";
    import Button from "$lib/components/ui/Button-full.svelte";
    import Nav from "$lib/components/Nav.svelte";
    let email = $state("");
    let password = $state("");
    let confirmPassword = $state("");
    let result: { type: "success" | "error"; text: string } | null = null;
    const handleSubmit: SubmitFunction = () => {
        console.log("passed");
        result = null;
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        return async ({ result, update }) => {
            console.log("here");
            if (result.type === "success") {
                result = {
                    type: "success",
                    text: "check inbox to confirm registratiom",
                };
            } else {
                //display error message from server response
                result = {
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

<Nav />
<div class="justify-center items-center flex flex-col mt-50 mb-50">
    <form
        method="POST"
        action="/register?/register"
        class="grid grid-cols-1 gap-4 content-center"
        use:enhance={handleSubmit}
    >
        <label>
            Email:
            <input
                type="email"
                id="email"
                name="email"
                required
                bind:value={email}
            />
        </label>
        <label>
            Password:
            <input
                type="password"
                id="password"
                name="password"
                bind:value={password}
                required
            />
        </label>
        <label>
            Confirm Password:
            <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                bind:value={confirmPassword}
                required
            />
        </label>
        <Button />
    </form>
</div>

{#if result}
    <p class={result.type === "error" ? "error-message" : "success-message"}>
        {result.text}
    </p>
{/if}
