<script>
	let open = false;
</script>

<div class="drawer bg-slate-300 z-10">
	<input id="my-drawer-2" type="checkbox" class="drawer-toggle" bind:checked={open} />
	<label for="my-drawer-2" class="btn btn-circle btn-ghost drawer-button m-3">
		<svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
			{#if !open}
				<path
					fill-rule="evenodd"
					d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
					clip-rule="evenodd"
				></path>
			{:else}
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				></path>
			{/if}
		</svg>
	</label>
	<div class="fixed drawer-side">
		<label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
			<li><a href="/dashboard/">Home</a></li>
			<li><a href="/dashboard/category">category</a></li>
			<li><a href="/dashboard/product">product</a></li>
			<li><a href="/dashboard/invoice">invoice</a></li>
			<li><a href="/dashboard/docs">Documents</a></li>
			<li><a href="/pos">open POS</a></li>
		</ul>
	</div>
</div>
