import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import axios from 'axios';

const prisma = new PrismaClient();

async function fetchWebsitesAndCreateHit() {
	const websites = await prisma.website.findMany();

	for (const website of websites) {
		const response = await axios.get(website.url, {
			validateStatus: () => true
		});
		const status = response.status;

		await prisma.hit.create({
			data: {
				status: status,
				website: { connect: { id: website.id } }
			}
		});

		console.log(`Hit recorded for ${website.url} with status ${status}`);
	}
}

cron.schedule('* * * * *', () => {
	console.log('Running cron job to fetch websites and create hit records');
	fetchWebsitesAndCreateHit();
});
