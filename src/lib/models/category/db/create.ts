import prisma from '$lib/helpers/prisma';
import { validate_type, user_type } from '$lib/helpers/validate_user';
import { is_category } from '../validator/validate';

export async function create(token: string, body: any) {
	if (!validate_type(token, [user_type.ADMIN])) {
		throw new Error('user does not have the previlage');
	}
	const parsed = await is_category(body);

	if (!parsed.success) {
		throw new Error('your object has an error');
	}

	const category = await prisma.category.create({
		data: body
	});

	return category;
}
