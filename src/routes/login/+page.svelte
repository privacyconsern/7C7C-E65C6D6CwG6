<script lang="ts">
    // Access the form validation errors returned by 'fail'
    export let form; 
</script>

<h1>Login</h1>

<form method="POST">
    <label>
        Email:
        <input name="email" type="email" value={form?.email ?? ''} required>
    </label>
    
    <label>
        Password:
        <input name="password" type="password" required>
    </label>

    {#if form?.incorrect}
        <p class="error">Invalid credentials</p>
    {/if}

    <button>Log in</button>
</form>