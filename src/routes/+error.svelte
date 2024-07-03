<script>
	import { page } from '$app/stores';
</script>

<div
	class="h-96 w-full max-w-3xl mx-auto flex align-middle content-center justify-center items-center"
>
	{#if $page.status === 404}
		<h1 class="text-center">NOT FOUND!</h1>
	{:else if $page.status === 500}
		<h1 class="text-center">SERVER ERROR!</h1>
	{:else}
		<h1 class="text-center">UNKNOW ERROR !</h1>
	{/if}
</div>
