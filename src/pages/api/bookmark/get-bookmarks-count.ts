import { type NextApiRequest, type NextApiResponse } from "next";
import { type SupabaseClient } from "@supabase/supabase-js";
import isEmpty from "lodash/isEmpty";

import { type BookmarksCountTypes } from "../../../types/apiTypes";
import {
	bookmarkType,
	CATEGORIES_TABLE_NAME,
	imageFileTypes,
	MAIN_TABLE_NAME,
	SHARED_CATEGORIES_TABLE_NAME,
	videoFileTypes,
} from "../../../utils/constants";
import {
	apiSupabaseClient,
	verifyAuthToken,
} from "../../../utils/supabaseServerClient";

type Data = {
	data: BookmarksCountTypes | null;
	error: string[] | null;
};

const getCategoryCount = async (
	supabase: SupabaseClient,
	_userId: string,
	categoryIds: number[],
	sharedCategories: unknown[],
) => {
	const buildCategoryPromises = categoryIds.map(async (categoryId) => {
		const { count } = await supabase
			.from(MAIN_TABLE_NAME)
			.select("id", { count: "exact", head: true })
			.eq("category_id", categoryId)
			.eq("trash", false);

		return {
			category_id: categoryId,
			count: count ?? 0,
		};
	});

	const sharedCategoryPromises = sharedCategories.map(
		async (sharedCategory) => {
			const { count } = await supabase
				.from(MAIN_TABLE_NAME)
				.select("id", { count: "exact", head: true })
				.eq("category_id", sharedCategory)
				.eq("trash", false);

			return {
				category_id: sharedCategory,
				count: count ?? 0,
			};
		},
	);

	const [userCategoryResults, sharedCategoryResults] = await Promise.all([
		Promise.all(buildCategoryPromises),
		Promise.all(sharedCategoryPromises),
	]);

	return [...userCategoryResults, ...sharedCategoryResults];
};

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) {
	const accessToken = request.query.access_token as string;
	const supabase = apiSupabaseClient();

	let userId: string | undefined;
	let email: string | undefined;

	const { error: authError, decoded } = verifyAuthToken(accessToken);

	if (authError) {
		response.status(401).json({ data: null, error: ["Unauthorized"] });
		return;
	} else {
		userId = decoded?.sub;
		email = decoded?.email;
	}

	let count: BookmarksCountTypes = {
		allBookmarks: 0,
		categoryCount: [],
		trash: 0,
		uncategorized: 0,
		images: 0,
		videos: 0,
		links: 0,
	};

	try {
		const [
			{ count: bookmarkCount },
			{ count: bookmarkImageCount },
			{ count: bookmarkVideoCount },
			{ count: bookmakrsLinks },
			{ count: bookmarkTrashCount },
			{ count: bookmarkUnCatCount },
			{ data: userCategoryIds },
			{ data: sharedCategoryIds },
		] = await Promise.all([
			supabase
				.from(MAIN_TABLE_NAME)
				.select("id", { count: "exact", head: true })
				.eq("user_id", userId)
				.eq("trash", false),
			supabase
				.from(MAIN_TABLE_NAME)
				.select("id", { count: "exact", head: true })
				.eq("user_id", userId)
				.eq("trash", false)
				.in("type", imageFileTypes),
			supabase
				.from(MAIN_TABLE_NAME)
				.select("id", { count: "exact", head: true })
				.eq("user_id", userId)
				.eq("trash", false)
				.in("type", videoFileTypes),
			supabase
				.from(MAIN_TABLE_NAME)
				.select("id", { count: "exact", head: true })
				.eq("user_id", userId)
				.eq("trash", false)
				.eq("type", bookmarkType),
			supabase
				.from(MAIN_TABLE_NAME)
				.select("id", { count: "exact", head: true })
				.eq("user_id", userId)
				.eq("trash", true),
			supabase
				.from(MAIN_TABLE_NAME)
				.select("id", { count: "exact", head: true })
				.eq("user_id", userId)
				.eq("trash", false)
				.eq("category_id", 0),
			supabase.from(CATEGORIES_TABLE_NAME).select("id").eq("user_id", userId),
			supabase
				.from(SHARED_CATEGORIES_TABLE_NAME)
				.select("category_id")
				.eq("email", email),
		]);

		count = {
			...count,
			allBookmarks: bookmarkCount ?? 0,
			images: bookmarkImageCount ?? 0,
			videos: bookmarkVideoCount ?? 0,
			links: bookmakrsLinks ?? 0,
			trash: bookmarkTrashCount ?? 0,
			uncategorized: bookmarkUnCatCount ?? 0,
		};

		const userCategoryIdsArray = userCategoryIds?.map((item) => item.id) ?? [];
		const sharedCategoryIdsArray =
			sharedCategoryIds?.map((item) => item.category_id) ?? [];

		const categoryCount = (await getCategoryCount(
			supabase,
			userId,
			userCategoryIdsArray,
			sharedCategoryIdsArray,
		)) as BookmarksCountTypes["categoryCount"];

		count = {
			...count,
			categoryCount,
		};
	} catch (error) {
		console.error("Error in API:", error);
		response.status(500).json({ data: null, error: ["Internal Server Error"] });
		return;
	}

	const errorMessages = ["Unauthorized", "Internal Server Error"];

	const nonEmptyErrors = errorMessages.filter((message) => !isEmpty(message));

	response.status(200).json({ data: count, error: nonEmptyErrors });
}
