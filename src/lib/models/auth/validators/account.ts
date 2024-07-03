import { z } from 'zod';

enum user_type {
	ADMIN = 'ADMIN',
	EMPLOYEE = 'EMPLOYEE',
	CUSTOMER = 'CUSTOMER'
}

export async function verify(body: any) {
	const schema = z.object({
		email: z
			.string()
			.min(1, { message: 'Email is required' })
			.email({ message: 'Please enter a valid email address.' })
			.refine(
				(email) => {
					const usernamePart = email.substring(0, email.indexOf('@'));
					return (
						!usernamePart.includes('+') &&
						!usernamePart.includes('.') &&
						email.endsWith('@gmail.com')
					);
				},
				{
					message: 'Only Gmail addresses (without + or . in email) are allowed.'
				}
			)
	});

	const parsed = schema.safeParse(body);
	return parsed;
}

export async function create(body: any) {
	const schema = z
		.object({
			token: z.string().min(1, { message: 'Token is required' }),
			name: z.string().min(1, { message: 'Name is required' }),
			type: z.nativeEnum(user_type),
			username: z
				.string()
				.regex(new RegExp('[A-Za-z0-9]'), {
					message: 'Username should have only characters and numbers '
				})
				.min(1, { message: 'Username is required' }),
			password: z.string().min(8, { message: 'Password Too Short' }),
			confirm_password: z.string().min(8, { message: 'Password Too Short' })
		})
		.refine((data) => data.password === data.confirm_password, {
			message: "Passwords don't match",
			path: ['confirm_password']
		});

	const parsed = schema.safeParse(body);
	return parsed;
}

export async function login(body: any) {
	const schema = z.object({
		user: z.string().min(1, { message: 'Username/Email is required' }),
		password: z.string().min(8, { message: 'Password Too Short' })
	});

	const parsed = schema.safeParse(body);
	return parsed;
}
