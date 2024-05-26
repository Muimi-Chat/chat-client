<script>
    import Navigation from '$lib/components/chat/Navigation.svelte';
	import Chat from "$lib/components/chat/Chat.svelte";

</script>

<div class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[20%_1fr]">
    <Navigation/>
    <Chat/>
</div>