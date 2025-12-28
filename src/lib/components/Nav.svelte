<script>
	import Modal from "$lib/components/ui/Modal.svelte";
	let isModalOpen = false;
</script>
<nav class="px-24 py-12">
		<a href="/" class="text-4xl font-poppins-bold">
                <span class="text-[#2300B0]">Reserve</span
				><span class="text-[#2E2E2E]">.it</span>
		</a>
		<a href="/restaurants" class="font-poppins-semi-bold text-[#2300B0] text-xl ml-20 justify-between gap-4 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#2300B0] after:transition-all after:duration-100 hover:after:w-full">resturats</a>
		<a href="/about" class="ml-4 nav-link-black text-xl">About</a>

		<button class="ml-86 text-xl font-poppins-regular mr-20 px-4 py-2 border border-black rounded-full text-black font-medium">
			<span class="mr-2 text-lg">🔍︎</span>
			<span>search</span>
			<span class="text-[#2300B0] ml-35">ctrl + k</span>
		</button>
        
		<a on:click={() => isModalOpen = true} class=" text-xl font-poppins-regular px-6 py-2 border border-black rounded-lg text-black font-medium hover:bg-black hover:text-white transition hover:rounded-none hover:cursor-pointer">Create an account</a>
		<a href="/login" class="text-xl font-poppins-semi-bold bg-[#2300B0] text-white px-6 py-2 rounded-lg ml-4 hover:rounded-none">Login</a>
</nav>
<Modal bind:showModal={isModalOpen} />