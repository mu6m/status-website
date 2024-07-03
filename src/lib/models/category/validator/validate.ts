import { z } from 'zod';

export async function is_category(body: any) {
	const schema = z.object({
		name: z.string().min(1, { message: 'name is required' })
	});

	const parsed = schema.safeParse(body);
	return parsed;
}
