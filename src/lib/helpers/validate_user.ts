import { verifyAccessToken } from '$lib/helpers/jwt';

export enum user_type {
	ADMIN,
	EMPLOYEE,
	CUSTOMER
}

export async function validate_type(token: string, types: user_type[]) {
	//validate the request
	const user = await verifyAccessToken(token);

	//is token valid
	if (user == false || !user) {
		return false;
	}

	//has previlage?
	for (const type of types) {
		if (user.type === type) {
			return true;
		}
	}
	return false;
}
