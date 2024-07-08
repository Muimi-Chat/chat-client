<script>
	import { removeSessionCookie } from "$lib/cookies/sessionCookie";
	import { removeUsernameCookie } from "$lib/cookies/usernameCookie";
	import delayedNavigate from "$lib/delayedNavigate";
	import { requestLogout } from "$lib/services/requestLogout";


    function triggerLogout() {
        removeSessionCookie();
        removeUsernameCookie();
        requestLogout();

        delayedNavigate('/login', 100);
    }
</script>

<a href="/settings">
	<button type="button" class="btn variant-filled-secondary">Settings</button>
</a>

<button on:click={triggerLogout} type="button" class="btn variant-filled-warning">Logout</button>

<style>
	.btn {
		margin-right: 25px;
	}
</style>
