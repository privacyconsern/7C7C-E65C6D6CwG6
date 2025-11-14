<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>
{#each data.tables as table}
    <p>{table.identification} {table.description}</p>
    {#each data.timeslots as timeslot}
        <p>{timeslot.start}{timeslot.end}</p>
    {/each}
{/each}