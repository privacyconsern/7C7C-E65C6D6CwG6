<script lang="ts">
    export let showModal = $props(boolean); // Control from parent
    export const showModal = boolean = $props();
    let dialog: HTMLDialogElement;

    // Watch the showModal prop to open/close the native dialog
    $: if (dialog && showModal) dialog.showModal();
    $: if (dialog && !showModal) dialog.close();
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
    
    let { show = $bindable() } = $props(); // Binding to control visibility
    let errorMessage = $state('');
    let isSubmitting = $state(false);

    const handleSubmit: SubmitFunction = () => {
        isSubmitting = true;
        errorMessage = '';

        return async ({ result, update }) => {
            isSubmitting = false;
            
            if (result.type === 'success') {
                // Handle success (e.g., show a success message or close modal)
                alert("Check your email!");
                show = false; 
            } else if (result.type === 'failure') {
                // result.data contains the 'fail(400, {error})' data
                errorMessage = result.data?.error ?? "An error occurred";
            }
            
            await update({ reset: result.type === 'success' });
        };
    };
</script>

<dialog
  bind:this={dialog}
  on:close={() => (showModal = false)}
  class="align-content-center justify-content-center m-auto rounded-lg p-0 shadow-2xl backdrop:bg-black/60"
>

  <div class="block w-[90vw] max-w-md bg-white p-8">
    <button 
      on:click={() => dialog.close()}
      class="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
    >
      ✕
    </button>

    <h2 class="text-xl font-bold mb-2">Enter your email</h2>
    <p class="text-sm text-gray-600 mb-6">
      Enter the email associated with your account. We'll send a code to that email.
    </p>

    <input 
      type="email" 
      placeholder="Email" 
      class="w-full border border-gray-300 rounded-md p-3 mb-4 focus:ring-2 focus:ring-[#2300B0] focus:outline-none"
    />

    <button class="w-full bg-[#da3743] text-white font-bold py-3 rounded-md hover:bg-[#2300B0] transition-colors">
      Continue
    </button>

    <button class="mt-6 text-red-600 font-medium text-sm hover:underline">
      Use phone instead
    </button>
  </div>
</dialog>

<style>
  
  /*prevent scroll*/
  :global(body:has(dialog[open])) {
    overflow: hidden;
  }
</style>