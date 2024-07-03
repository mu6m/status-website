<script>
	export let i;
	export let feature_arr;

	if (feature_arr.length == 0) {
		feature_arr[i] = {
			option: [],
			price_add_options: []
		};
	}
	let num_op = feature_arr[i].option.length;
</script>

<h2>feature {i} :</h2>
<div class="mb-4">
	<label class="block text-gray-700 text-sm font-bold mb-2" for={`f-${i}-name`}>name</label>
	<input
		class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
		type="text"
		name={`f-${i}-name`}
		placeholder="name"
		bind:value={feature_arr[i].name}
	/>
</div>
<div class="mb-4">
	<label for="type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>Select type</label
	>
	<select
		id="type"
		name={`f-${i}-type`}
		bind:value={feature_arr[i].type}
		class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
	>
		<option selected>Choose type</option>

		<option value="TEXT">text</option>
		<option value="OPTION">options</option>
		<option value="CHECKBOX">checkbox</option>
	</select>
</div>

{#if feature_arr[i].type === 'OPTION'}
	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="sku">number of options</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			type="number"
			min="0"
			bind:value={num_op}
		/>
	</div>
	{#each { length: num_op } as _, j}
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="sku">text for option {j}</label
			>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="limit"
				name="limit"
				type="text"
				bind:value={feature_arr[i].option[j]}
			/>
		</div>
		<div class="mb-4">
			<label class="block text-gray-700 text-sm font-bold mb-2" for="sku"
				>price for option {j}</label
			>
			<input
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				id="limit"
				name="limit"
				type="number"
				min="0"
				bind:value={feature_arr[i].price_add_options[j]}
			/>
		</div>
	{/each}
{:else}
	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="sku">price addition</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			id="limit"
			name="limit"
			type="number"
			min="0"
			bind:value={feature_arr[i].price_add}
		/>
	</div>
{/if}

<div class="flex items-center mb-4">
	<input
		name={`f-${i}-req`}
		type="checkbox"
		value=""
		class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
		bind:checked={feature_arr[i].required}
	/>
	<label for={`f-${i}-req`} class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
		>required</label
	>
</div>
