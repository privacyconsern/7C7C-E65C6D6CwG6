<script lang="ts">
    import type { PageProps } from './$types';
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';
    let result: { type: 'success' | 'error', text: string } | null = null;
    let email: string = '';
    let password: string = '';
    let confirmPassword: string = '';
    const apiUrl = '/api/register'; // This proxies to http://localhost:5069/register and it like actually does!!!!

    async function handleRegister(){
        if (password !== confirmPassword){
            alert('Passwords do not match!');
            return;
        }
        const userData = { email, password };
        try {
            const res = await fetch(apiUrl,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!res.ok) throw new Error('Registration failed');

            alert('Registration successful!');
            goto('/login');
        } catch (err){
            console.error('Registration failed', err);
            alert('Registration failed! Try again.');
        }
    }
    let { data }: PageProps = $props();
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