import prisma from '$lib/helpers/prisma';
import { validate_type, user_type } from '$lib/helpers/validate_user';
import { z } from 'zod';

async function validate(body: any) {
	const schema = z.object({
		id: z.array(z.string())
	});

	const parsed = schema.safeParse(body);
	return parsed;
}
export async function edit(body: any, token: string) {
	if (!validate_type(token, [user_type.ADMIN, user_type.EMPLOYEE])) {
		throw new Error('user does not have the previlage');
	}

	const parsed = await validate(body);
	if (!parsed.success) {
		throw new Error('your object has an error');
	}
	const invoice = await prisma.$transaction(async (tx) => {
		for (const id of body.id) {
			await tx.invoiceAndProducts.update({
				where: {
					id
				},
				data: {
					refunded: true
				}
			});
		}
	});

	return invoice;
}
