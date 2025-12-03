<script lang="ts">
    export let form;
</script>

<h1>Login</h1>

<form method="POST">
    <label>
        Email: <input name="email" type="email" required value={form?.email ?? ''} />
    </label>
    <label>
        Password: <input name="password" type="password" required />
    </label>
    <button>Log In</button>

    {#if form?.error}
        <p style="color: red">{form.error}</p>
    {/if}
</form>