<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let per_page;
	export let cur_page: number;
	export let max_count;
	let max_page = Math.ceil(max_count / per_page);
</script>

<div class="join">
	{#if cur_page > 1}
		<button
			class="join-item btn"
			on:click={async () => {
				let query = new URLSearchParams($page.url.searchParams.toString());

				query.set('page', (cur_page - 1).toString());

				await goto(`?${query.toString()}`);
			}}>«</button
		>
	{/if}

	{#if per_page < max_count}
		<button class="join-item btn">{cur_page}</button>
	{/if}

	{#if cur_page < max_page}
		<button
			class="join-item btn"
			on:click={async () => {
				let query = new URLSearchParams($page.url.searchParams.toString());

				query.set('page', (cur_page + 1).toString());

				await goto(`?${query.toString()}`);
			}}>»</button
		>
	{/if}
</div>
