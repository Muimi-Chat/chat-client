<script>
	import { getSessionCookie, removeSessionCookie } from '$lib/cookies/sessionCookie';
	import { getUsernameCookie, removeUsernameCookie } from '$lib/cookies/usernameCookie';
	import delayedNavigate from '$lib/delayedNavigate';
	import { getTokenCount } from '$lib/services/token/getTokenCount';
	import { Avatar } from '@skeletonlabs/skeleton';

	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	const toastStore = getToastStore();

	const username = getUsernameCookie();

	let tokenCount = '...';

	onMount(() => {
		const session = getSessionCookie();

		getTokenCount(username, session).then(handleGetTokenCountResult);
	});

	// @ts-ignore
	function handleGetTokenCountResult(result) {
		const resultStatus = result.status;
		let toastOptions = undefined;

		console.debug(`Got token count result :: ${resultStatus}`);
		switch (resultStatus) {
			case 'SUCCESS':
				tokenCount = result.token;
				break;
			case 'BAD_USERNAME':
				toastOptions = {
					message: 'Error! Try logging in again!',
					background: 'variant-filled-error'
				};
				removeSessionCookie();
				removeUsernameCookie();
				break;
			case 'BAD_SESSION':
				toastOptions = {
					message: 'Your session has expired! Try refreshing the page and logging in again!',
					background: 'variant-filled-error'
				}
				removeSessionCookie();
				removeUsernameCookie();
			case 'ERROR':
				toastOptions = {
					message: 'Unknown error in fetching token. Contact admin if persists!',
					background: 'variant-filled-error'
				};
				break;
		}

		if (toastOptions !== undefined) {
			toastStore.trigger(toastOptions);
		}
	}

	function gotoSettings(){
		delayedNavigate('/settings', 50)
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="horizontal-stack">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div class="avatar-container" on:click={gotoSettings} tabindex="0">
		<Avatar
			initials={username}
			border="border-4 border-surface-200-500-token hover:!border-primary-400"
			cursor="cursor-pointer"
		/>
	</div>
	<div>
		<h4 class="h4">{username}</h4>
		<p class="p">Tokens: {tokenCount}</p>
	</div>
</div>

<style>
	.horizontal-stack {
		display: flex;
		align-items: center;
		gap: 1rem; /* Adjust the gap between elements as needed */
	}

	.avatar-container {
		display: flex;
		align-items: center;
	}
</style>
