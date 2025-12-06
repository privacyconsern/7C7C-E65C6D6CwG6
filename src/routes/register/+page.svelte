<script lang="ts">
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
    import type { PageProps } from './$types';
    let { data, form }: PageProps = $props();
    let email = $state('');
    let password = $state('');
    let confirmPassword = $state('');
    let result: { type: 'success' | 'error', text: string } | null = null;
    const handleRegister: SubmitFunction = () => {
        console.log("passed")
        result = null;

        return async ({ result, update }) => {
            console.log("here")
            if (result.type === 'success') {
                result = {type: "success", text: "check inbox to confirm registratiom"}
            }
            else {
                //display error message from the server action
                result = { type: 'error', text: `An unexpected error occurred. ${result.data?.error}` };
                console.log(result.data?.error)
            }
            //page reload (optional)
            await update();
        };
    };
</script>
<form method="POST" action="?/register" use:enhance={handleRegister}>
        <label>
        Email:
        <input type="email" bind:value={email} required />
    </label>
    <label>
        Password:
        <input type="password" bind:value={password} required />
    </label>
    <label>
        Confirm Password:
        <input type="password" bind:value={confirmPassword} required />
    </label>
    <button type="submit">Register</button>
</form>

    {#if result}
        <p class={result.type === 'error' ? 'error-message' : 'success-message'}>
            {result.text}
        </p>
    {/if}