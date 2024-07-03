import prisma from '$lib/helpers/prisma';

export const load = async ({ locals }: any) => {
	const websites = await prisma.website.findMany();
	let hits: any = {};
	for (const site of websites) {
		const hit = await prisma.hit.findMany({
			where: {
				websiteId: site.id,
				status: {
					not: 100
				}
			},
			take: 5,
			orderBy: {
				time: 'desc'
			}
		});
		hits[site.id] = hit;
	}
	return {
		hits,
		websites,
		...locals
	};
};
