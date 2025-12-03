<!-- Email Confirm Token -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { API } from '$env/static/private';

    let message = 'Verifying your email...';
    let isSuccess = false;
    
    onMount(async () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const email = params.get('email');

        if (!token || !email) {
            message = 'Invalid confirmation link.';
            return;
        }

        try {
            const res = await fetch(`${API}/validate-register-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionToken: token, email })
            });

            if (!res.ok) throw new Error('Failed to verify email.');

            message = 'Your email has been successfully verified! Redirecting...';
            isSuccess = true;
            setTimeout(() => goto('/login'), 3000);
        } catch (err) {
            console.error(err);
            message = 'Verification failed. The link may be invalid or expired.';
            isSuccess = false;
        }
    });
</script>

<h2 class={isSuccess ? 'success' : 'error'}>{message}</h2>

<style>
    .success { color: green; }
    .error { color: red; }
</style>