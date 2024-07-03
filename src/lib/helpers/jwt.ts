import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

declare module 'jsonwebtoken' {
	export interface NewUserJwtPayload extends jwt.JwtPayload {
		email: string;
	}
}

export async function signAccessToken(payload: any) {
	return jwt.sign(payload, JWT_SECRET);
}

export async function verifyAccountMaking(token: any) {
	try {
		const decodedToken = <jwt.NewUserJwtPayload>jwt.verify(token, JWT_SECRET);
		return decodedToken;
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return false;
		}
	}
}

export async function verifyAccessToken(token: any) {
	try {
		const decodedToken = <any>jwt.verify(token, JWT_SECRET);
		return decodedToken;
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return false;
		}
	}
}
