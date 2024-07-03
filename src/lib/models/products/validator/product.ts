import { z } from 'zod';

export async function is_product(body: any) {
	const schema = z.object({
		title: z.string().min(1, { message: 'Title is required' }),
		content: z.string().optional(),
		sku: z.string().optional(),
		images: z.array(z.string()),
		limit: z.number().nullable(),
		categoryId: z.string().optional(),
		published: z.boolean().optional(),
		pos: z.boolean().optional()
	});

	const parsed = schema.safeParse(body);
	return parsed;
}
enum feature_type {
	CHECKBOX = 'CHECKBOX',
	OPTION = 'OPTION',
	TEXT = 'TEXT'
}
export async function is_feature(body: any) {
	const schema = z.array(
		z
			.object({
				name: z.string().min(1, { message: 'Name is required' }),
				type: z.nativeEnum(feature_type),

				required: z.boolean().optional(),
				price_add: z.number().optional(),
				price_add_options: z.array(z.number()).optional(),

				option: z.array(z.string()).optional()
			})
			.refine((data) => {
				if (data.price_add_options?.length != data.option?.length) {
					return false;
				}
				return true;
			})
	);

	const parsed = schema.safeParse(body);
	return parsed;
}
