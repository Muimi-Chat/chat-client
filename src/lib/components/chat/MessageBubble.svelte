<script>
    import { Avatar } from '@skeletonlabs/skeleton';

    export let isHost = false
    export let authorName = ""
    export let readableTimestamp = ""
    export let message = ""
</script>


{#if isHost}
    <div class="grid grid-cols-[1fr_auto] gap-2">
        <div class="card p-4 rounded-tr-none space-y-2 variant-soft-primary">
            <header class="flex justify-between items-center">
                <p class="font-bold">{authorName}</p>
                <small class="opacity-50">{readableTimestamp}</small>
            </header>
            <p>{message}</p>
        </div>
        <Avatar src="https://i.pravatar.cc/?img=14" width="w-12" />
    </div>
{:else}
    <div class="grid grid-cols-[auto_1fr] gap-2">
        <Avatar src="https://i.pravatar.cc/?img=48" width="w-12" />
        <div class="card p-4 variant-soft rounded-tl-none space-y-2">
            <header class="flex justify-between items-center">
                <p class="font-bold">{authorName}</p>
                <small class="opacity-50">{readableTimestamp}</small>
            </header>
            <p>{message}</p>
        </div>
    </div>
{/if}