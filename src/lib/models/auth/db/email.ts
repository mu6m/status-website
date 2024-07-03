import { signAccessToken } from '$lib/helpers/jwt';
import { Resend } from 'resend';
import { RESEND_TOKEN } from '$env/static/private';

export async function send_code({ email }: { email: string }) {
	const resend = new Resend(RESEND_TOKEN);
	const code = await signAccessToken({ email });
	const { MODE } = import.meta.env;

	const domain =
		MODE === 'development' ? 'http://localhost:5173' : 'https://os-my-invoice.vercel.app';
	const resp = await resend.emails.send({
		from: 'noreply@ledraa.space',
		to: email,
		subject: 'My Invoice Account Creation Link',
		html: `<p>thank's for choosing my-invoice here is your <a href="${domain}/auth/verify/${code}">link</a> for account creation</p>`
	});
	return resp.error == null;
}
