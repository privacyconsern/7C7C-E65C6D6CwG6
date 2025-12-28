<script>
  import Modal from "$lib/components/ui/Modal2.svelte";
  let isModalOpen = false;
</script>

<main class="p-8">
  <h1 class="text-2xl mb-4">Welcome to the App</h1>
  
  <button 
    on:click={() => isModalOpen = true}
    class="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Open Login Modal
  </button>

  <Modal bind:showModal={isModalOpen} />
</main>