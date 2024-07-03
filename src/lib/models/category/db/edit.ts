import { verifyAccessToken, signAccessToken } from '$lib/helpers/jwt';
import prisma from '$lib/helpers/prisma';
import { user_type, validate_type } from '$lib/helpers/validate_user';
import { z } from 'zod';

async function validate(body: any) {
	const schema = z.object({
		category_id: z.string().min(1, { message: 'id is required' }),
		category_name: z.string().min(1, { message: 'name is required' })
	});

	const parsed = schema.safeParse(body);
	return parsed;
}
export async function edit(jwt_token: string, body: any) {
	if (!validate_type(jwt_token, [user_type.ADMIN, user_type.EMPLOYEE])) {
		throw new Error('user does not have the previlage');
	}

	const parsed = await validate(body);
	if (!parsed.success) {
		throw new Error(parsed.error.message);
	}

	const cat = await prisma.category.update({
		where: {
			id: body.category_id
		},
		data: {
			name: body.category_name
		}
	});

	return cat;
}
