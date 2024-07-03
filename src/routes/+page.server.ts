import prisma from '$lib/helpers/prisma';
import { fail } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, cookies }: any) => {
		const form_data = await request.formData();
		const url = form_data.get('url') as string;
		if (!url) {
			return fail(400);
		}
		const data = await prisma.website.create({
			data: {
				url
			}
		});
		return data;
	}
};
