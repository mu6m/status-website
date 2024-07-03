import { signAccessToken } from '$lib/helpers/jwt';
import prisma from '$lib/helpers/prisma';
import bcrypt from 'bcrypt';
import { login } from '../validators/account';

export async function login_account(body: any) {
	const parsed = await login(body);
	if (!parsed.success) {
		throw new Error(parsed.error.message);
	}
	let user = await prisma.user.findFirst({
		where: { OR: [{ username: body.user }, { email: body.user }] }
	});
	if (!user) {
		throw new Error('user not found');
	}
	const result = await bcrypt.compare(body.password, user.password);
	if (!result) {
		throw new Error('password is wrong');
	}
	delete (user as any)['password'];
	const token = await signAccessToken(user);
	return token;
}
