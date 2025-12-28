<script lang="ts">
  export let showModal: boolean; // Control from parent
  import Button from './Button-full.svelte';
  import GoogleLogo from "$lib/assets/Google__G__logo.svg";
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  let dialog: HTMLDialogElement;
   let email = $state('');
    let password = $state('');
    let confirmPassword = $state('');
    let result: { type: 'success' | 'error', text: string } | null = null;
  const handleSubmit: SubmitFunction = () => {
        console.log("passed")
        result = null;
        if (password !== confirmPassword){
            alert('Passwords do not match!');
            return;
        }
        return async ({ result, update }) => {
            console.log("here")
            if (result.type === 'success') {
                result = {type: "success", text: "check inbox to confirm registratiom"}
            }
            else {
                //display error message from server response
                result = { type: 'error', text: `An unexpected error occurred. ${result.data?.error}` };
                console.log(result.data?.error)
            }
            //page reload (optional)
            await update();
        };
    };
  // Watch the showModal prop to open/close the native dialog
  $: if (dialog && showModal) dialog.showModal();
  $: if (dialog && !showModal) dialog.close();
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
    <h2 class="pb-2 text-xl font-bold mb-2">Select sign-in method</h2>
    <button class="group relative inline-flex items-stretch overflow-hidden bg-[#2300B0] font-sans text-white transition-transform active:scale-98 shadow-sm rounded-lg hover:transition hover:rounded-none w-full">
      <div class="flex items-center transition-colors px-6">
        <img src={GoogleLogo} alt="Google Logo" class="h-5 w-5"/>
      </div>
      <div class="flex items-center px-6 py-3 font-medium text-lg tracking-wide">
        <slot>Sign in with google</slot>
      </div>
      <div class="flex items-center transition-colors justify-end pr-8">
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
    <hr class="mt-5 h-1 border-t-2 text-align-center border-stone-400 after:content-['§']" />
    
    <h2 class="py-6 text-xl font-bold mb-2">Or sign in with email</h2>
    <form 
      method="POST" 
      action="/register?/register" 
      use:enhance={handleSubmit}
    >
      <input 
        type="email" 
        placeholder="Email"
        id="email" 
        name="email" 
        required
        bind:value={email}
        class="w-full border border-gray-300 rounded-md p-3 mb-4 focus:ring-2 focus:ring-[#2300B0] focus:outline-none"
      />
      <input 
        type="password" 
        placeholder="Password" 
        class="w-full border border-gray-300 rounded-md p-3 mb-4 focus:ring-2 focus:ring-[#2300B0] focus:outline-none"
      />
      <input 
        type="confirm-password" 
        placeholder="Confirm Password" 
        class="w-full border border-gray-300 rounded-md p-3 mb-4 focus:ring-2 focus:ring-[#2300B0] focus:outline-none"
      />
      <Button />
      </div>
    </form>
</dialog>

<style>
  
  /*prevent scroll*/
  :global(body:has(dialog[open])) {
    overflow: hidden;
  }
</style>