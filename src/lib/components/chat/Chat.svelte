<script>
	import MessageBubble from './MessageBubble.svelte';

    /**
	 * @type {HTMLElement}
	 */
    let elemChat;
    let messageFeed = [
		{
			id: 0,
			host: true,
			avatar: 48,
			name: 'Jane',
			timestamp: 'Yesterday @ 2:30pm',
			message: "lorem",
			color: 'variant-soft-primary'
		},
		{
			id: 1,
			host: false,
			avatar: 14,
			name: 'Michael',
			timestamp: 'Yesterday @ 2:45pm',
			message: "lorem",
			color: 'variant-soft-primary'
		},
		{
			id: 2,
			host: true,
			avatar: 48,
			name: 'Jane',
			timestamp: 'Yesterday @ 2:50pm',
			message: 'test',
			color: 'variant-soft-primary'
		},
		{
			id: 3,
			host: false,
			avatar: 14,
			name: 'Michael',
			timestamp: 'Yesterday @ 2:52pm',
			message: "asda",
			color: 'variant-soft-primary'
		}
	];
	let currentMessage = '';

    /**
	 * @param {ScrollBehavior} behavior
	 */
    function scrollChatBottom(behavior) {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

    function getCurrentTimestamp() {
		return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	}

	function addMessage() {
		const newMessage = {
			id: messageFeed.length,
			host: true,
			avatar: 48,
			name: 'Jane',
			timestamp: `Today @ ${getCurrentTimestamp()}`,
			message: currentMessage,
			color: 'variant-soft-primary'
		};
		// Update the message feed
		messageFeed = [...messageFeed, newMessage];
		// Clear prompt
		currentMessage = '';
		// Smooth scroll to bottom
		// Timeout prevents race condition
		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);
	}

	/**
	 * @param {{ code: string; preventDefault: () => void; }} event
	 */
	function onPromptKeydown(event) {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
	}

</script>

<div class="grid grid-row-[1fr_auto]">
    <!-- Conversation -->
    <section bind:this={elemChat} class="h-[650px] max-h-[650px] p-4 overflow-y-auto space-y-4">
        {#each messageFeed as bubble}
            <MessageBubble
                isHost={bubble.host}
                authorName={bubble.name}
                readableTimestamp={bubble.timestamp}
                message={bubble.message}
            />
        {/each}
    </section>
    <!-- Prompt -->
    <section class="border-t border-surface-500/30 p-4">
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token">
            <button class="input-group-shim">+</button>
            <textarea
                bind:value={currentMessage}
                class="bg-transparent border-0 ring-0"
                name="prompt"
                id="prompt"
                placeholder="Write a message..."
                rows="1"
                on:keydown={onPromptKeydown}
            ></textarea>
            <button class={currentMessage ? 'variant-filled-primary' : 'input-group-shim'} on:click={addMessage}>
                <i class="fa-solid fa-paper-plane"></i>
            </button>
        </div>
    </section>
</div>