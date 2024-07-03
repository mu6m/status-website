import { z } from 'zod';

export async function is_invoice(body: any) {
	const schema = z.object({
		products: z.array(
			z.object({
				id: z.string().min(1, { message: 'product_id is required' }),
				count: z.number().gte(1, { message: 'count should be atleast 1' }),
				features: z.array(
					z.object({
						product_featuresId: z.string().min(1, { message: 'id is required' }),
						checked: z.boolean().optional(),
						typed: z.string().optional(),
						option_index: z.number().optional()
					})
				)
			})
		)
	});

	const parsed = schema.safeParse(body);
	return parsed;
}
