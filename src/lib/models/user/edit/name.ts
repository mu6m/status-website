import { verifyAccessToken, signAccessToken } from '$lib/helpers/jwt';
import prisma from '$lib/helpers/prisma';
import { z } from 'zod';

async function validate(body: any) {
	const schema = z.object({
		name: z.array(z.string())
	});

	const parsed = schema.safeParse(body);
	return parsed;
}
export async function action(body: any, jwt_token: string) {
	const token = await verifyAccessToken(jwt_token);
	if (token === false || !token) {
		throw new Error('error in token');
	}

	const parsed = await validate(body);
	if (!parsed.success) {
		throw new Error(parsed.error.message);
	}

	if (body.name.length <= 0) {
		throw new Error('name is empty');
	}
	const old_user = await prisma.user.findFirst({
		where: {
			id: token.id
		}
	});

	if (!old_user) {
		throw new Error('user does not exist');
	}

	const new_user = await prisma.user.update({
		where: {
			id: token.id
		},
		data: {
			name: body.name
		}
	});
	delete (new_user as any)['password'];
	const user_token = await signAccessToken(new_user);
	return user_token;
}
