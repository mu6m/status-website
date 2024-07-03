import { verifyAccessToken } from '$lib/helpers/jwt';
import prisma from '$lib/helpers/prisma';
import { validate_type, user_type } from '$lib/helpers/validate_user';
import { Prisma } from '@prisma/client';
import { is_invoice } from '../validator/validate';
import { v4 as uuidv4 } from 'uuid';

export async function create(token: string, body: any) {
	if (!validate_type(token, [user_type.ADMIN, user_type.CUSTOMER, user_type.EMPLOYEE])) {
		throw new Error('user does not have the previlage');
	}
	const user = await verifyAccessToken(token);
	const parsed = await is_invoice(body);
	if (!parsed.success) {
		throw new Error('your object has an error');
	}

	//sum the products
	let merged: any = {};
	body.products.forEach((product: any) => {
		if (merged[product.id]) {
			merged[product.id].count += product.count;
			for (const item of product.features) {
				merged[product.id].features.add(item.product_featuresId);
			}
		} else {
			// Otherwise, initialize with the product
			merged[product.id] = {
				id: product.id,
				count: product.count,
				features: new Set()
			};
			for (const item of product.features) {
				merged[product.id].features.add(item.product_featuresId);
			}
		}
	});
	let db_pro = await prisma.product.findMany({
		where: {
			id: {
				in: Object.keys(merged)
			}
		},
		include: {
			product_features: true
		}
	});
	db_pro = db_pro.reduce((acc: any, obj) => {
		acc[obj.id] = obj;
		return acc;
	}, {});

	//simply check for limit and required
	for (const key in merged) {
		const item = merged[key];
		const pro = db_pro[key];
		if (pro.limit && item.count > pro.limit) {
			throw new Error('limit exceeded');
		}
		for (const feat of pro.product_features) {
			if (feat.required) {
				if (!item.features.has(feat.id)) {
					throw new Error('some features are required');
				}
			}
		}
	}
	//format the features
	let inv_arr: any[] = [];
	for (let item of body.products) {
		let fet_arr: any[] = [];
		for (let feat of item.features) {
			let op_feat: any = undefined;
			for (const pro_feat of db_pro[item.id].product_features) {
				if (pro_feat.id == feat.product_featuresId) {
					op_feat = pro_feat;
				}
			}
			if (feat.type == 'OPTION') {
				feat.option = op_feat.option[feat.option_index];
				feat.price = op_feat.price_add_options[feat.option_index];
			} else {
				feat.price = op_feat.price_add;
			}
			delete feat.option_index;
			fet_arr.push({
				id: uuidv4(),
				price: feat.price,
				option: feat.option,
				typed: feat.typed,
				checked: feat.checked,
				product_featuresId: feat.product_featuresId
			});
		}
		inv_arr.push({
			id: uuidv4(),
			product: item.id,
			count: item.count,
			features: fet_arr
		});
	}
	//read many
	//update many
	await prisma.$transaction(
		async (tx) => {
			for (const key in merged) {
				await tx.product.update({
					where: {
						id: merged[key].id
					},
					data: {
						limit: {
							decrement: merged[key].count
						}
					}
				});
			}
			//create invoice
			console.log('long transaction');
			const inv_id = uuidv4();

			console.log(
				`INSERT INTO "invoice" ("id", "userId", "createdAt", "updatedAt") VALUES ('${inv_id}', '${user.id}', now(), now())`
			);

			await tx.$executeRawUnsafe(
				`INSERT INTO "invoice" ("id", "userId", "createdAt", "updatedAt") VALUES ('${inv_id}', '${user.id}', now(), now())`
			);
			let values = inv_arr.map(
				(item) => `('${item.id}', '${item.product}', '${inv_id}', '${item.count}', false)`
			);
			let query = `INSERT INTO "InvoiceAndProducts" ("id", "productId", "invoiceId", "count", "refunded") VALUES ${values.join(',')}`;
			await tx.$executeRawUnsafe(query);
			let feat_values = inv_arr.map((item) => {
				return item.features.map((feat: any) => {
					return `('${feat.id}', ${feat.checked}, '${feat.typed}', '${feat.option}', '${feat.price}', '${feat.product_featuresId}', '${item.id}')`;
				});
			});
			console.log(feat_values);
			let feat_query = `INSERT INTO "product_feature_invoice" ("id", "checked", "typed", "option", "price", "product_featuresId", "invoiceAndProductsId") VALUES ${feat_values.join(',')}`;
			await tx.$executeRawUnsafe(feat_query);
		},
		{
			maxWait: 100000,
			timeout: 100000,
			isolationLevel: Prisma.TransactionIsolationLevel.Serializable
		}
	);

	return true;
}
