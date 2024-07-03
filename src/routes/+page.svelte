<!-- TODO: implement auto refresh by making an api endpoint and fetching for every N seconds or use websockets -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	console.log($page.data);
</script>

<form action="?/create" method="POST" class="max-w-sm mx-auto" use:enhance>
	<div class="mb-5">
		<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>website url</label
		>
		<input
			type="url"
			name="url"
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			required
		/>
	</div>
	<button
		type="submit"
		class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>Add</button
	>
</form>
<ul class="max-w-sm list-disc mx-auto flex flex-col gap-4 my-6">
	{#each $page.data.websites as website}
		<li>
			<p>url: <b>{website.url}</b></p>
			<ol class="list-decimal list-inside">
				{#each $page.data.hits[website.id] as hit}
					<li>
						<p>status: {hit.status}</p>
						<p>time: {hit.time}</p>
					</li>
				{/each}
			</ol>
		</li>
	{/each}
</ul>
