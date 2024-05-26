<script>
    import { Avatar, CodeBlock } from '@skeletonlabs/skeleton';

    /**
	 * @type {HTMLElement}
	 */
    let elemChat;
    const people = [
		{ id: 0, avatar: 14, name: 'Michael' },
		{ id: 1, avatar: 40, name: 'Janet' },
		{ id: 2, avatar: 31, name: 'Susan' },
		{ id: 3, avatar: 56, name: 'Joey' },
		{ id: 4, avatar: 24, name: 'Lara' },
		{ id: 5, avatar: 9, name: 'Melissa' }
	];

	let currentPersonId = people[0].id;

</script>
<div class="hidden lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
    <!-- Header -->
    <header class="border-b border-surface-500/30 p-4">
        <input class="input" type="search" placeholder="Search..." />
    </header>
    <!-- List -->
    <div class="p-4 space-y-4 overflow-y-auto">
        <small class="opacity-50">Contacts</small>
        <div class="flex flex-col space-y-1">
            {#each people as person}
                <button
                    type="button"
                    class="btn w-full flex items-center space-x-4 {person.id === currentPersonId
                        ? 'variant-filled-primary'
                        : 'bg-surface-hover-token'}"
                    on:click={() => (currentPersonId = person.id)}
                >
                    <Avatar src="https://i.pravatar.cc/?img={person.avatar}" width="w-8" />
                    <span class="flex-1 text-start">
                        {person.name}
                    </span>
                </button>
            {/each}
        </div>
    </div>
    <!-- Footer -->
    <!-- <footer class="border-t border-surface-500/30 p-4">(footer)</footer> -->
</div>