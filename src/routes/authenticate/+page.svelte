<script>
    import { getToastStore } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore()

    import { goto} from "$app/navigation";
    import { onMount } from 'svelte';

	import { Turnstile } from 'svelte-turnstile';
	import { CLOUDFLARE_SITE_KEY } from '$lib/const';
	import { getUserAuthenticationCSRFToken } from '$lib/services/csrfTokenFetcher/getUserAuthenticationCSRFToken';
	import { verifyEmail } from '$lib/services/emailVerification/verifyEmail';
 	/**
	 * @type {(() => void) | undefined}
	 */
     let reset;

    let csrfToken = ''; 
    let code = '';
    let id = '';

    // For requesting new token.

    let turnstileToken = '';
    onMount(() => {
        const hash = window.location.hash.slice(1); // Remove the leading #
        const params = new URLSearchParams(hash);

        code = params.get('code') ?? "";
        id = params.get('id') ?? "";

        if (!code || !id) {
            toastStore.trigger({
                message: 'Failed to authenticate. Please try again, or request for new token!',
                timeout: 5000,
                background: 'variant-filled-error',
            });
        }
        console.debug(`Code :: ${code} | ID :: ${id}`)

		getUserAuthenticationCSRFToken()
		.then((token) => {
			csrfToken = token
		}).catch((error) => {
			console.error(`Failed to fetch CRSF Token :: ${error}`)
			// TODO: Display error to the user...
		})
    });

    function validateToken() {
        if (!code || !id || !turnstileToken) {
            console.warn('There is still errors or blank fields, yet user invoked login function!');
            return;
        }

        verifyEmail(id, code, csrfToken, turnstileToken).then((data) => {
            if (data.status == "SUCCESS") {
                toastStore.trigger({
                    message: 'Authentication successful! Please login.',
                    timeout: 5000,
                    background: 'variant-filled-success',
                });

				setTimeout(() => {
					window.location.href = '/login';
				}, 2000);
                return;
            }

            reset?.();

            toastStore.trigger({
                message: 'Failed to authenticate. Please try again, or request for new token!',
                timeout: 5000,
                background: 'variant-filled-error',
            });
        })
    }

    /**
     * @param {any} result
    */
	function onTurnstileCallbackjs(result) {
		turnstileToken = result.detail.token
	}
</script>


<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">

        <button type="button" on:click={validateToken} class="btn variant-filled">Click me to authenticate!</button>

        {#if !(!code || !id)}
            <Turnstile
                bind:reset
                siteKey={CLOUDFLARE_SITE_KEY}
                on:turnstile-callback={onTurnstileCallbackjs}
            />
        {/if}

        <p class="mt-4">Not working? <a class="anchor" href="/newtoken">Request new authenication link!</a></p>

    </div>
</div>