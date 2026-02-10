<script lang="ts">
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import type { PageData } from "./$types";

    //svelteKit automatically provides the data returned from the load function in +page.server.ts
    let { data }: { data: PageData } = $props();
    let message = data.message;
    let isSuccess = data.isSuccess;

    $effect(() => {
        if (isSuccess) {
            //nav magic
            setTimeout(() => {
                goto(resolve("/login"));
            }, 3000);
        }
    });
</script>

<h2 class={isSuccess ? "success" : "error"}>{message}</h2>

<style>
    .success {
        color: green;
    }
    .error {
        color: red;
    }
</style>
