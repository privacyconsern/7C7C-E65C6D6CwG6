<script lang="ts">
    export let form;
</script>


<div class="flex-grow flex flex-col">
    <div class="w-80 flex-shrink-0 bg-white border-l border-slate-200 shadow-md p-4">
        <h1>Login</h1>
    <form method="POST">
        <label>
            Email: <input name="email" type="email" required value={form?.email ?? ''} />
        </label>
        <label>
            Password: <input name="password" type="password" required />
        </label>
        <button class="group relative inline-flex items-stretch overflow-hidden bg-[#2300B0] font-sans text-white transition-transform active:scale-98 shadow-sm rounded-lg hover:transition hover:rounded-none w-full">
            <div class="flex items-center px-6 py-3 font-medium text-lg tracking-wide">
                <slot>Login</slot>
            </div>
            <div class="flex items-center transition-colors">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                class="h-5 w-5 transform transition-transform group-hover:translate-x-1"
            >
            <path d="M8 5v14l11-7z" />
            </svg>
            </div>
        </button>

        {#if form?.error}
            <p style="color: red">{form.error}</p>
        {/if}
    </form>
    </div>
</div>
<!--w-80 flex-shrink-0 bg-white border-l border-slate-200 shadow-md p-4-->