/* eslint-disable complexity */

import { type NextApiRequest, type NextApiResponse } from "next";
import {
	type PostgrestError,
	type PostgrestResponse,
} from "@supabase/supabase-js";
import { type VerifyErrors } from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import isNull from "lodash/isNull";

import {
	type BookmarksWithTagsWithTagForginKeys,
	type SingleListData,
} from "../../../types/apiTypes";
import {
	BOOKMARK_TAGS_TABLE_NAME,
	bookmarkType,
	GET_TEXT_WITH_AT_CHAR,
	imageFileTypes,
	IMAGES_URL,
	LINKS_URL,
	TRASH_URL,
	UNCATEGORIZED_URL,
	videoFileTypes,
	VIDEOS_URL,
} from "../../../utils/constants";
import { checker } from "../../../utils/helpers";
import {
	apiSupabaseClient,
	verifyAuthToken,
} from "../../../utils/supabaseServerClient";

// searches bookmarks

// TODO: current logic not efficient, rethink this logic

type DataResponse = SingleListData[] | null;
type ErrorResponse = PostgrestError | VerifyErrors | string | null;

type Data = {
	data: DataResponse;
	error: ErrorResponse;
};

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) {
	const { error: _error } = verifyAuthToken(
		request.query.access_token as string,
	);

	if (_error) {
		response.status(500).json({ data: null, error: _error });
		throw new Error("ERROR: token error");
	}

	const supabase = apiSupabaseClient();

	// disabling as this check is not needed here
	const { category_id, is_shared_category } = request.query;
	const search = request.query.search as string;

	const searchText = search?.replace(GET_TEXT_WITH_AT_CHAR, "");

	const matchedSearchTag = search?.match(GET_TEXT_WITH_AT_CHAR);

	const tagName =
		!isEmpty(matchedSearchTag) && !isNull(matchedSearchTag)
			? matchedSearchTag?.map((item) => item?.replace("@", ""))
			: undefined;

	const tokenDecode: { sub: string } = jwtDecode(
		request.query.access_token as string,
	);

	// disabling as this check is not needed here
	const user_id = tokenDecode?.sub;

	let query = supabase
		.rpc("search_bookmarks", {
			search_text: searchText,
		})
		.eq("trash", category_id === TRASH_URL);

	if (is_shared_category === "false") {
		// if the collection is a shared one then is_shared_category will be true
		// if it is not a shared collection then add user_is to the filter query, as we need to bookmarks that have the uploaded by the user alone
		// if its is a shared collection then we need all the bookmarks in the collection irrespective of the user ,
		// because many people belongling to the collection would have uploaded their bookmarks
		query = query.eq("user_id", request.query.user_id);
	}

	if (
		!isNull(category_id) &&
		category_id !== "null" &&
		category_id !== TRASH_URL &&
		category_id !== IMAGES_URL &&
		category_id !== VIDEOS_URL &&
		category_id !== LINKS_URL
	) {
		query = query.eq(
			"category_id",
			category_id === UNCATEGORIZED_URL ? 0 : category_id,
		);
	}

	if (category_id === IMAGES_URL) {
		query = query.in("type", imageFileTypes);
	}

	if (category_id === VIDEOS_URL) {
		query = query.in("type", videoFileTypes);
	}

	if (category_id === LINKS_URL) {
		query = query.eq("type", bookmarkType);
	}

	const { data, error } = (await query) as unknown as {
		data: DataResponse;
		error: ErrorResponse;
	};

	const { data: allUserBookmarksWithTags } = await supabase
		.from(BOOKMARK_TAGS_TABLE_NAME)
		.select(
			`
bookmark_id,
tag_id (
	id,
	name
)
`,
		)
		.eq("user_id", user_id);
	if (!tagName) {
		// user has searched for text without tags

		const finalData = data?.map((item) => {
			const matchedBookmarkWithTag = allUserBookmarksWithTags?.filter(
				(tagItem) => tagItem?.bookmark_id === item?.id,
			) as BookmarksWithTagsWithTagForginKeys;

			if (!isEmpty(matchedBookmarkWithTag)) {
				return {
					...item,
					addedTags: matchedBookmarkWithTag?.map((matchedItem) => ({
						id: matchedItem?.tag_id?.id,
						name: matchedItem?.tag_id?.name,
					})),
				};
			}

			return item;
		}) as SingleListData[];

		response.status(200).json({ data: finalData, error });
	} else {
		// user searched for tags
		let tagSearchQuery = supabase
			.from(BOOKMARK_TAGS_TABLE_NAME)
			.select(
				`
      bookmark_id (*),
      tag_id!inner(
        id,
        name
      )
    `,
			)
			.eq("user_id", user_id)
			.in("tag_id.name", tagName);

		if (
			!isNull(category_id) &&
			category_id !== "null" &&
			category_id !== TRASH_URL &&
			category_id !== IMAGES_URL &&
			category_id !== VIDEOS_URL &&
			category_id !== LINKS_URL
		) {
			tagSearchQuery = tagSearchQuery.eq(
				"bookmark_id.category_id",
				category_id === UNCATEGORIZED_URL ? 0 : category_id,
			);
		}

		if (category_id === IMAGES_URL) {
			tagSearchQuery = tagSearchQuery.in("bookmark_id.type", imageFileTypes);
		}

		if (category_id === VIDEOS_URL) {
			tagSearchQuery = tagSearchQuery.in("bookmark_id.type", videoFileTypes);
		}

		if (category_id === LINKS_URL) {
			tagSearchQuery = tagSearchQuery.eq("bookmark_id.type", bookmarkType);
		}

		let { data: bookmarksWithTags } =
			(await tagSearchQuery) as PostgrestResponse<{
				bookmark_id: SingleListData;
				tag_id: number;
			}>;

		// we filter out any null values
		bookmarksWithTags = bookmarksWithTags
			? bookmarksWithTags?.filter((item) => item?.bookmark_id !== null)
			: [];

		if (isEmpty(searchText?.trim())) {
			// user as only searched for tags and no text

			// get all unique bookmark ids
			const allBookmarkIds = bookmarksWithTags?.map(
				(item) => item?.bookmark_id?.id,
			);

			const onlyUniqueBookmarkIds = [...new Set(allBookmarkIds)];

			// fetch the tags for the bookmarks

			const finalResponse = onlyUniqueBookmarkIds?.map((item) => {
				const matchedBookmarkWithTag = allUserBookmarksWithTags?.filter(
					(tagItem) => tagItem?.bookmark_id === item,
				) as BookmarksWithTagsWithTagForginKeys;

				const bookmarkData = find(
					bookmarksWithTags,
					(bookmarkItem) => bookmarkItem?.bookmark_id?.id === item,
				);

				if (!isEmpty(matchedBookmarkWithTag)) {
					return {
						...bookmarkData?.bookmark_id,
						addedTags: matchedBookmarkWithTag?.map((matchedItem) => ({
							id: matchedItem?.tag_id?.id,
							name: matchedItem?.tag_id?.name,
						})),
					};
				}

				return item;
			}) as SingleListData[];

			// this filters from current res, this helps is intersection filter
			const finalResponseFiltered = finalResponse?.filter((item) => {
				const currentTagsNames = item?.addedTags?.map(
					(tagItem) => tagItem?.name,
				);

				return checker(currentTagsNames, tagName);
			});
			// const four = "44444";

			response.status(200).json({
				// data: finalResponse,
				data: finalResponseFiltered,
				error,
			});
		} else {
			// user searched for tag with text
			const finalData = data?.filter((item) => {
				const bookmarkTagId = find(
					bookmarksWithTags,
					(tagBookmark) => tagBookmark?.bookmark_id?.id === item?.id,
				);

				if (bookmarkTagId) {
					return item;
				}

				return null;
			});

			const finalAddedTagsData = finalData?.map((item) => {
				// get all tags for the bookmark
				const allBookmarkTags = allUserBookmarksWithTags?.filter(
					(tagItem) => tagItem?.bookmark_id === item?.id,
				) as BookmarksWithTagsWithTagForginKeys;
				if (allBookmarkTags) {
					return {
						...item,
						addedTags: allBookmarkTags?.map((matchedItem) => ({
							id: matchedItem?.tag_id?.id,
							name: matchedItem?.tag_id?.name,
						})),
					};
				}

				return null;
			}) as unknown as SingleListData[] | null;

			// this checks if all the tags in search are present in the bookmark, if even one search tag is missing in the bookmark tags then the bookmark will not be returned
			const finalDataWithTextTagAndOperatorFilter = finalAddedTagsData?.filter(
				(item) => {
					const allAddedTags = item?.addedTags?.map(
						(addedTagsItem) => addedTagsItem?.name,
					);

					const tags = checker(allAddedTags, tagName);

					return tags;
				},
			) as unknown as SingleListData[] | null;

			response.status(200).json({
				data: finalDataWithTextTagAndOperatorFilter,
				error,
			});
		}
	}
}
