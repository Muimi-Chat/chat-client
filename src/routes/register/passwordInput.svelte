<script>
	import Icon from '@iconify/svelte';

    export let value = '';
    export let error = '';
    export let disabled = false

    let showPassword = false
    let inputClasses = 'input-group input-group-divider grid-cols-[1fr_auto]';
    
     $: {
        inputClasses = 'input-group input-group-divider grid-cols-[1fr_auto]' + (error.length ? ' input-warning' : '');
    }

    // @ts-ignore
    function handleChange(event) {
        value = event.target.value;
    }

    function handleBlur() {
		const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
		if (value.length === 0) {
			error = 'Password is required';
		} else if (value.length < 8) {
            error = 'Password must be at least 8 characters long'
        } else if (!passwordRegex.test(value)) {
			error = 'Password must contain at least one letter and one number';
		} else {
			error = '';
		}
    }
</script>

<h6 class="h6 mt-3">Password</h6>
<div class={inputClasses}>
    <input type={showPassword ? 'text' : 'password'} disabled={disabled} placeholder="Enter password..." on:blur={handleBlur} on:input={handleChange} />
    {#if showPassword}
        <div>
            <button
                type="button"
                class="btn-icon !bg-transparent"
                on:click={() => (showPassword = !showPassword)}
            >
                <Icon icon="gridicons:not-visible" />
            </button>
        </div>
    {:else}
        <div>
            <button
                type="button"
                class="btn-icon !bg-transparent"
                on:click={() => (showPassword = !showPassword)}
            >
                <Icon icon="gridicons:visible" />
            </button>
        </div>
    {/if}
</div>
{#if error.length !== 0}
    <p class="text-red-500">{error}</p>
{/if}