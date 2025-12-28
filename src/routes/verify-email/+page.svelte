<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types'; //PageData for server-loaded data

    //svelteKit automatically provides the data returned from the load function
    let { data }: { data: PageData } = $props();
    let message = data.message;
    let isSuccess = data.isSuccess;

    // A reactive statement ($:) that runs whenever a dependency changes.
    // In this case, it runs once the component mounts and 'isSuccess' is available.
    $effect(() => {
        if (isSuccess) {
            // Client-side navigation logic is safe here
            setTimeout(() => {
                goto('/login');
            }, 3000);
        }
    });
</script>

<h2 class={isSuccess ? 'success' : 'error'}>{message}</h2>

<style>
    .success { color: green; }
    .error { color: red; }
</style>