<script>
    import { getToastStore } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore()

    import { goto} from "$app/navigation";
    import { onMount } from 'svelte';
	import { getConversations } from '$lib/services/chat/getConversations';
	import { getSessionCookie, removeSessionCookie, setSessionCookie } from '$lib/cookies/sessionCookie';
	import { getUsernameCookie, removeUsernameCookie } from '$lib/cookies/usernameCookie';
	import { CHAT_WS_API_ENDPOINT } from '$lib/const';
    import MessageBubble from '$lib/components/chat/MessageBubble.svelte';
	import { getConversationMessages } from '$lib/services/chat/getConversationMessages';

	/**
	 * @type {WebSocket | undefined}
	 */
	let socket;

    /**
	 * @type {HTMLElement}
	 */
    let elemChat;
    /**
	 * @type {any[]}
	 */
    let conversations = [];
    /**
	 * @type {number | null}
	 */
    let selectedConversationID = null;
    /**
	 * @type {any[]}
	 */
    let messages = [];
	let loadingBotMessage = false;
	let currentMessage = '';
 
    /**
	 * @param {string} sessionToken
	 * @param {string} username
	 */
    async function loadConversationHistory(sessionToken, username) {
        const result = await getConversations(username, sessionToken)
        const status = result.status;

        if (status === "SUCCESS") {
            conversations = result.data;
            console.debug(`Succesfully fetched conversations :: ${conversations}`)
            return;
        }

        if (status === "BAD_SESSION") {
            removeSessionCookie()
            removeUsernameCookie()
            const t = {
                message: 'Your session has expired! Please refresh the page and login again!',
                background: 'variant-filled-warning',
            };
            toastStore.trigger(t)
            return
        }

        const t = {
            message: 'Unknown error occured! Refresh page or contact admin if persists!',
            background: 'variant-filled-error',
        };
        toastStore.trigger(t)
    }

    onMount(() => {
        const sessionToken = getSessionCookie()
        const username = getUsernameCookie()

        if (sessionToken === undefined || username === undefined) {
            goto('/login');
            return
        }

        loadConversationHistory(sessionToken, username)
    });

	async function loadConversationMessages() {
		const sessionToken = getSessionCookie()
		const username = getUsernameCookie()
		if (selectedConversationID == null) {
			console.warn('currentConversationID is null, yet loadConversationMessages was invoked!');
			return
		}

		const result = await getConversationMessages(username, sessionToken, selectedConversationID)
		console.debug(`Succesfully fetched conversation messages :: ${JSON.stringify(result)}`)
        if (result.status === 'SUCCESS') {
			messages = result.data
			return
		}

		if (result.status === 'BAD_SESSION') {
			removeSessionCookie()
			removeUsernameCookie()
			const t = {
				message: 'Your session has expired! Please refresh the page and login again!',
				background: 'variant-filled-warning',
			};
			toastStore.trigger(t)
			return
		}
	}
    
    /**
	 * @param {number | null} conversationID
	 */
    function setConversationID(conversationID) {
        if (selectedConversationID == conversationID) {
            console.warn(`Tried to set conversation ${conversationID} which is already selected!`);
            return
        }
        selectedConversationID = conversationID

        if (selectedConversationID == null) {
            messages = []
        } else {
            loadConversationMessages()
        }
    }

    /**
	 * @param {ScrollBehavior} behavior
	 */
    function scrollChatBottom(behavior) {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

    function getCurrentTimestamp() {
		return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	}
	/**
	 * @param {{ code: string; preventDefault: () => void; }} event
	 */
	function onPromptKeydown(event) {
		// @ts-ignore
		if (event.code === 'Enter' && !event.shiftKey) {
			sendMessage();
		}
	}

	function sendMessage(){
		if (!currentMessage.trim()) {
			console.warn("Tried to send an empty message!")
			return
		}

		if (socket == undefined) {
			console.warn("Tried to send message but socket is undefined!")
			return
		}

		if (socket.readyState !== WebSocket.OPEN) {
			console.warn("Tried to send message but socket is not open!")
			return
		}
	
		const data = {
			'session_token': getSessionCookie(),
			'username': getUsernameCookie(),
			'user_agent': navigator.userAgent,
			'chat_model': 'gpt-3.5-turbo',
			'conversation_id': selectedConversationID,
			'message': currentMessage
		}
		loadingBotMessage = true
		socket.send(JSON.stringify(data));

		messages.push({
			id: -1,
			token_cost: null,
			content: currentMessage,
			author: "USER",
			created_at: new Date()
		})
		currentMessage = "";
	}

//#region Websocket Management

	/**
	 * @param {MessageEvent<any>} event
	 */
	function handleSocketMessageIncoming(event) {
		const data = JSON.parse(event.data);
		console.debug('WS Message incoming:', data);
		
		if (data.status === 'BAD_SESSION') {
			removeSessionCookie()
			removeUsernameCookie()
			const t = {
				message: 'Your session has expired! Please refresh the page and login again!',
				background: 'variant-filled-warning',
			};
			toastStore.trigger(t)
			return
		}

		if (data.status === 'INSUFFICENT_TOKEN') {
			const t = {
				message: 'Insufficient amount of token to chat with bot. Try again later!',
				background: 'variant-filled-warning',
			};
			toastStore.trigger(t)
			return
		}

		if (data.status === "NEW_CONVERSATION") {
			conversations.push({
				id: data.conversation_id,
				title: data.conversation_title,
				created_at: new Date(),
			})

			selectedConversationID = data.conversation_id

			return
		}

		if (data.status === "CHUNK_START") {
			messages.push({
				id: -2,
				token_cost: null,
				content: "",
				author: "BOT",
				created_at: new Date()	
			})
			return
		}

		if (data.status === "CHUNK") {
			// Add chunk to message's content.
			messages = messages.map(message => message.id === -2 ? { ...message, content: message.content + data.chunk_content } : message)
			return
		}

		if (data.status === "CHUNK_END") {
			messages = messages.map(message => {
				if (message.id === -2) {
					return { ...message, created_at: new Date(), id: data.bot_message_data.id, content: data.reply_content, token_cost: data.bot_message_data.token_cost }
				}

				if (message.id === -1) {
					return { ...message, id: data.user_message_data.id, token_cost: data.user_message_data.token_cost }
				}

				return message
			})

			loadingBotMessage = false;
			return;
		}

		console.debug(`Unknown WS status received: ${data.status}`)
	}

	onMount(() => {
		socket = new WebSocket(`${CHAT_WS_API_ENDPOINT}/api-chat/chat`);

		// Handle WebSocket events
		socket.addEventListener('open', () => {
			console.debug('WebSocket connection opened');
		});

		socket.addEventListener('message', (event) => {
			handleSocketMessageIncoming(event);
		});

		socket.addEventListener('close', () => {
		console.debug('WebSocket connection closed');
		});

		socket.addEventListener('error', (error) => {
			console.error('WebSocket error:', error);
		});
  	});
</script>

<div class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[20%_1fr]">
    <div class="hidden lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
        <!-- Header -->
        <header class="border-b border-surface-500/30 p-4">
            <input class="input" type="search" placeholder="Search..." />
        </header>
        <!-- List -->
        <div class="p-4 space-y-4 overflow-y-auto">
                <button
                    type="button"
                    class="btn w-full flex items-center space-x-4 {selectedConversationID === null
                        ? 'variant-filled-primary'
                        : 'bg-surface-hover-token'}"
                    on:click={() => setConversationID(null)}
                    disabled={selectedConversationID == null}
                >
                    <span class="flex-1 text-start">
                        New Conversation
                    </span>
                </button>
            <br>
            <small class="mt-9 opacity-50">History</small>
            <div class="flex flex-col space-y-1">
                {#each conversations as conversation}
                    <button
                        type="button"
                        class="btn w-full flex items-center space-x-4 {conversation.id === selectedConversationID 
                            ? 'variant-filled-primary'
                            : 'bg-surface-hover-token'}"
                        on:click={() => setConversationID(conversation.id)}
                        disabled={conversation.id === selectedConversationID}
                    >
                        <span class="flex-1 text-right">
                            {conversation.title.length > 30 ? `${conversation.title.substring(0, 30)}...` : conversation.title}
                        </span>
                    </button>
                {/each}
            </div>
        </div>
    </div>
    
    <div class="grid grid-row-[1fr_auto]">
        <!-- Conversation -->
        <section bind:this={elemChat} class="h-[650px] max-h-[650px] p-4 overflow-y-auto space-y-4">
            {#if selectedConversationID === null}
                <MessageBubble
                    isHost={false}
                    authorName="System"
                    readableTimestamp={getCurrentTimestamp()}
                    message="Select a conversation on the left! Or start chatting here to create a new one!"
                />
            {:else}
                {#each messages
                     as bubble}
                    <MessageBubble
                        isHost={bubble.author === "USER"}
                        authorName={bubble.author === "USER" ? getUsernameCookie() : bubble.bot_model}
                        readableTimestamp={new Date(bubble.created_at).toDateString()}
                        message={bubble.content}
                    />
                {/each}
            {/if}
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
                    rows="4"
                    on:keydown={onPromptKeydown}
                ></textarea>
                <button class={currentMessage ? 'variant-filled-primary' : 'input-group-shim'} disabled={loadingBotMessage || !currentMessage} on:click={sendMessage}>
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </section>
    </div>
</div>