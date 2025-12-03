<script lang="ts">
    import type { PageProps } from './$types';
	import { RotateCcw, MousePointer, BrickWall, Square, Flower, Flower2, Leaf, Palette } from "lucide-svelte";
	import { enhance } from '$app/forms';
	let firstname: string = '';
    let lastname: string = '';
    let email: string = '';

	async function handleReserve(){
        const userData = { firstname, lastname, email };
        try {
            const res = await fetch(apiUrl,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!res.ok) throw new Error('Registration failed');

            alert('Registration successful!');
            goto('/login');
        } catch (err){
            console.error('Registration failed', err);
            alert('Registration failed! Try again.');
        }
    }
    let { data }: PageProps = $props();
</script>
<ul>
	{#each data.tables as table}
	<div class="flex justify-content my-2">
		<p>{table.identification}{table.timeSlots.startTime}</p>
		<!--
		<form method="POST" action="?/register" use:enhance={handleReserve}>
        	<label>
        		First Name:
        		<input type="firstname" bind:value={firstname} required />
    		</label>
    		<label>
        		Last Name:
        		<input type="lastname" bind:value={lastname} required />
    		</label>
    		<label>
        		Email:
       			<input type="email" bind:value={email} required />
    		</label>
			<button class="bg-[#2300B0] px-4 flex items-center justify-center" type="submit">
    	    	<p class="text-white">reserve</p>
   			</button>
		</form>-->
		<button class="bg-[#2300B0] px-4 flex items-center justify-center" type="submit">
    	    <p class="text-white">reserve</p>
   		</button>
	</div>
	{/each}
	{#each data.timeslots as timeslot}
		<p>{timeslot.starttime}, {timeslot.endtime}</p>
	{/each}
</ul>