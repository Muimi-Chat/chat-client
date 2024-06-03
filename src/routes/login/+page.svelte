<script>
	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import { Stretch } from 'svelte-loading-spinners';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { getUserAuthenticationCSRFToken } from '$lib/services/csrfTokenFetcher/getUserAuthenticationCSRFToken';
	import Cookies from 'js-cookie';

	const toastStore = getToastStore();
	// Store for CSRF token
	let csrfToken = '';
	onMount(() => {
		getUserAuthenticationCSRFToken()
			.then((token) => {
				csrfToken = token;
			})
			.catch((error) => {
				console.error(`Failed to fetch CRSF Token :: ${error}`);
				// TODO: Display error to the user...
			});
	});

	import UsernameInput from './usernameInput.svelte';
	let username = '';
	let usernameError = '';

	import PasswordInput from './passwordInput.svelte';
	import { loginUserAPI } from '$lib/services/authentication/loginUserAPI';
	import { setSessionCookie } from '$lib/cookies/sessionCookie';
	import { setUsernameCookie } from '$lib/cookies/usernameCookie';
	let password = '';
	let passwordError = '';

	let genericError = '';

	$: loadingAPI = false;

	async function register() {
		genericError = '';
		if (
			usernameError.length !== 0 ||
			passwordError.length !== 0 ||
			username.length === 0 ||
			password.length === 0
		) {
			console.warn('There is still errors or blank fields, yet user invoked login function!');
			return;
		}

		try {
			const inputUsername = username;
			loadingAPI = true;

			console.debug(`Using token :: ${csrfToken}`);
			const result = await loginUserAPI(username, password, csrfToken);
			console.debug(result);

			if (result.status === 'SUCCESS') {
				setUsernameCookie(inputUsername)
				setSessionCookie(result.token, 30)
				// TODO: Maybe redirect after to some other page after few seconds?
			} else if (result.status === 'TIMEOUT') {
				const t = {
					message: 'Too many attempts made in a short period! Try again later!',
					timeout: 10000,
					background: 'variant-filled-warning'
				};
				toastStore.trigger(t);
			} else if (result.status === 'BAD_USERNAME') {
				usernameError = "The username doesn't exist!";
			} else if (result.status === 'BAD_PASSWORD') {
				passwordError = 'The password is incorrect!';
			} else if (result.status === 'BANNED') {
				const t = {
					message: 'Sorry, your account was banned.',
					timeout: 10000,
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
			} else if (result.status === 'LOCKED') {
				const t = {
					message: 'Your account was locked out! Try contacting admin.',
					timeout: 10000,
					background: 'variant-filled-warning'
				};
				toastStore.trigger(t);
			} else {
				genericError =
					'Unknown Error! Refresh page and try again!\nContact admin if issue persists!';
			}
		} catch (error) {
			// @ts-ignore
			console.error(error.message);
			genericError = 'Unknown Error! Refresh page and try again!\nContact admin if issue persists!';
		} finally {
			loadingAPI = false;
		}
	}

	$: registrationDisabled =
		usernameError.length !== 0 ||
		passwordError.length !== 0 ||
		username.length === 0 ||
		password.length === 0;
</script>

<div class="container h-full mx-auto justify-center items-center">
	<h2 class="h2 m-4">Login into an existing account!</h2>

	<UsernameInput bind:disabled={loadingAPI} bind:error={usernameError} bind:value={username} />

	<PasswordInput bind:disabled={loadingAPI} bind:error={passwordError} bind:value={password} />
	{#if loadingAPI}
		<div>
			<Stretch size="60" color="#FF3E00" unit="px" duration="1s" />
		</div>
	{/if}

	<button
		type="button"
		disabled={registrationDisabled || loadingAPI}
		class="mt-3 btn variant-filled"
		on:click={register}
	>
		Login
	</button>

	<div class="mt-2">
		<i>
			Don't have an account? <a class="anchor" href="/register">Register</a> instead.
		</i>
	</div>

	{#if genericError.length !== 0}
		<p class="text-red-500">{genericError}</p>
	{/if}
</div>
