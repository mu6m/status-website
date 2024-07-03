import { verifyAccessToken, signAccessToken } from '$lib/helpers/jwt';
import prisma from '$lib/helpers/prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';

async function validate(body: any) {
	const schema = z.object({
		cur_password: z.string().min(8, { message: 'current password too short' }),
		edit_password: z.string().min(8, { message: 'new password too short' })
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

	const old_user = await prisma.user.findFirst({
		where: {
			id: token.id
		}
	});

	if (!old_user) {
		throw new Error('user does not exist');
	}
	const hashed_old = await bcrypt.hash(body.cur_password, 10);
	const result = await bcrypt.compare(old_user.password, hashed_old);
	if (!result) {
		throw new Error('password is wrong');
	}
	const hashed_new = await bcrypt.hash(body.edit_password, 10);
	const new_user = await prisma.user.update({
		where: {
			id: token.id
		},
		data: {
			password: hashed_new
		}
	});
	delete (new_user as any)['password'];
	const user_token = await signAccessToken(new_user);
	return user_token;
}
