import { verifyAccountMaking, signAccessToken } from '$lib/helpers/jwt';
import prisma from '$lib/helpers/prisma';
import bcrypt from 'bcrypt';
import { config } from '$lib/helpers/config';

export async function create_account(body: any) {
	//check if admin exsist if you want to create an admin
	//else create the user

	const token = await verifyAccountMaking(body.token);
	if (token === false || !token) {
		throw new Error('error in token');
	}
	if (config['limited_admins'] && body.type === 'ADMIN') {
		const admin_user = await prisma.user.findMany({
			where: {
				type: 'ADMIN'
			}
		});
		if (admin_user.length > 0) {
			throw new Error('admin user already exists');
		}
	}
	body.password = await bcrypt.hash(body.password, 10);
	let user = await prisma.user.create({
		data: {
			email: token.email,
			type: body.type,
			name: [body.name],
			username: body.username,
			password: body.password
		}
	});
	delete (user as any)['password'];
	const user_token = await signAccessToken(user);
	return user_token;
}
