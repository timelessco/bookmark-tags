// table names
export const MAIN_TABLE_NAME = "bookmarks_table";
export const TAG_TABLE_NAME = "tags";
export const BOOKMARK_TAGS_TABLE_NAME = "bookmark_tags";
export const CATEGORIES_TABLE_NAME = "categories";
export const SHARED_CATEGORIES_TABLE_NAME = "shared_categories";
export const PROFILES = "profiles";
export const BOOKMAKRS_STORAGE_NAME = "bookmarks";
export const FILES_STORAGE_NAME = "files";
export const USER_PROFILE_STORAGE_NAME = "user_profile";

export const STORAGE_SCRAPPED_IMAGES_PATH = "public/scrapped_imgs";
export const STORAGE_SCREENSHOT_IMAGES_PATH = "public/screenshot_imgs";

// regx

export const URL_PATTERN =
	// eslint-disable-next-line no-useless-escape, unicorn/no-unsafe-regex
	/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[\da-z]+([.\-][\da-z]+)*\.[a-z]{2,6}(:\d{1,5})?(\/.*)?$/gu;
export const GET_NAME_FROM_EMAIL_PATTERN = /^([^@]*)@/u;
export const GET_TEXT_WITH_AT_CHAR = /[A-Za-z]*@[A-Za-z]*/gu;
export const EMAIL_CHECK_PATTERN =
	// eslint-disable-next-line unicorn/no-unsafe-regex, unicorn/better-regex, require-unicode-regexp, regexp/strict, regexp/no-useless-escape, no-useless-escape
	/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
// eslint-disable-next-line unicorn/better-regex, require-unicode-regexp, regexp/no-useless-escape, regexp/strict, no-useless-escape
export const LETTERS_NUMBERS_CHECK_PATTERN = /^[^*|\":<>[\]{}`\\()';@&$]+$/;
export const URL_IMAGE_CHECK_PATTERN =
	// eslint-disable-next-line unicorn/no-unsafe-regex
	/^http[^?]*.(jpg|jpeg|gif|png|tiff|bmp|webp)(\?(.*))?$/gimu;

// api constants
const getBaseUrl = () => {
	if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
		return process.env.NEXT_PUBLIC_SITE_URL;
	}

	if (
		process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
		process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
	) {
		return `${process.env.NEXT_PUBLIC_VERCEL_URL}`;
	}

	return "http://localhost:3000/";
};

// const getBaseUrl = () =>
// 	"https://bookmark-tags-git-file-upload-feat-timelessco.vercel.app";

export const NEXT_API_URL = `${getBaseUrl()}api`;
export const TIMELESS_SCRAPPER_API =
	"https://link-preview-livid-ten.vercel.app/api/getUrlData";
// export const SCREENSHOT_API = "https://strapi.tmls.dev/screenshot?url=";
export const SCREENSHOT_API = "https://screenshot-api.tmls.dev/screenshot";

export const PAGINATION_LIMIT = 25;

// auth api
// no auth api yet
// bookmark api
export const GET_BOOKMARKS_DATA_API = "/bookmark/get-bookmarks-data";
export const DELETE_BOOKMARK_DATA_API = "/bookmark/delete-bookmark";
export const ADD_BOOKMARK_MIN_DATA = "/bookmark/add-bookmark-min-data";
export const ADD_URL_SCREENSHOT_API = "/bookmark/add-url-screenshot";
export const MOVE_BOOKMARK_TO_TRASH_API = "/bookmark/move-bookmark-to-trash";
export const CLEAR_BOOKMARK_TRASH_API = "/bookmark/clear-bookmark-trash";
export const FETCH_BOOKMARKS_VIEW = "/bookmark/fetch-bookmarks-view";
export const SEARCH_BOOKMARKS = "/bookmark/search-bookmarks";
export const GET_BOOKMARKS_COUNT = "/bookmark/get-bookmarks-count";
export const ADD_REMAINING_BOOKMARK_API =
	"/bookmark/add-remaining-bookmark-data";

// tags api
export const FETCH_USER_TAGS_API = "/tags/fetch-user-tags";
export const CREATE_USER_TAGS_API = "/tags/create-user-tags";
export const ADD_TAG_TO_BOOKMARK_API = "/tags/add-tag-to-bookmark";
export const REMOVE_TAG_FROM_BOOKMARK_API = "/tags/remove-tag-from-bookmark";
// category api
export const FETCH_USER_CATEGORIES_API = "/category/fetch-user-categories";
export const CREATE_USER_CATEGORIES_API = "/category/create-user-category";
export const ADD_CATEGORY_TO_BOOKMARK_API =
	"/category/add-category-to-bookmark";
export const DELETE_USER_CATEGORIES_API = "/category/delete-user-category";
export const UPDATE_USER_CATEGORIES_API = "/category/update-user-category";
export const UPDATE_CATEGORY_ORDER_API = "/category/update-category-order";
// share api
export const GET_PUBLIC_CATEGORY_BOOKMARKS_API =
	"/get-public-category-bookmarks";
// collab share api
export const FETCH_SHARED_CATEGORIES_DATA_API =
	"/share/fetch-shared-categories-data";
export const UPDATE_SHARED_CATEGORY_USER_ROLE_API =
	"/share/update-shared-category-user-role";
export const DELETE_SHARED_CATEGORIES_USER_API =
	"/share/delete-shared-categories-user";
export const SEND_COLLABORATION_EMAIL_API = "/share/send-collaboration-email";
// profiles api
export const FETCH_USER_PROFILE_API = "/profiles/fetch-user-profile";
export const UPDATE_USER_PROFILE_API = "/profiles/update-user-profile";
export const GET_USER_PROFILE_PIC_API = "/profiles/get-user-profile-pic";
export const UPDATE_USERNAME_API = "/profiles/update-username";
export const DELETE_USER_API = "/profiles/delete-user";
export const REMOVE_PROFILE_PIC_API = "/profiles/remove-profile-pic";

// settings profile api
export const UPLOAD_PROFILE_PIC_API = "/settings/upload-profile-pic";

// file upload api
export const UPLOAD_FILE_API = "/file/upload-file";

// urls
export const ALL_BOOKMARKS_URL = "all-bookmarks";
export const UNCATEGORIZED_URL = "uncategorized";
export const SEARCH_URL = "search";
export const INBOX_URL = "inbox";
export const TRASH_URL = "trash";
export const SETTINGS_URL = "settings";
export const LOGIN_URL = "login";
export const SIGNUP_URL = "signup";
export const SIGNIN_URL = "login";
export const IMAGES_URL = "images";
export const VIDEOS_URL = "videos";
export const LINKS_URL = "links";

// react-query keys

export const BOOKMARKS_KEY = "bookmarks";
export const BOOKMARKS_COUNT_KEY = "bookmarks_count";
export const CATEGORIES_KEY = "categories";
export const USER_TAGS_KEY = "userTags";
export const BOOKMARKS_VIEW = "bookmarks_view";
export const USER_PROFILE = "user_profile";
export const USER_PROFILE_PIC = "user_profile_pic";

// error msgs

export const ADD_UPDATE_BOOKMARK_ACCESS_ERROR =
	"You dont have access to add to this category, this bookmark will be added without a category";
export const DUPLICATE_CATEGORY_NAME_ERROR =
	"You already have a category with this name , please add any other name";

// accepted file type constants
export const acceptedFileTypes = [
	"image/jpg",
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/heic",
	"video/mp4",
	"video/mov",
	"video/wmv",
	"video/webm",
	"application/pdf",
	"audio/mp3",
	"audio/mpeg",
];

export const bookmarkType = "bookmark";

export const imageFileTypes = acceptedFileTypes?.filter(
	(item) => item?.includes("image"),
);

export const videoFileTypes = acceptedFileTypes?.filter(
	(item) => item?.includes("video"),
);

// color picker colors
export const colorPickerColors = [
	"#ffffff",
	"#1a1a1a",

	"#ff2d5f",
	"#ff339b",
	"#ea35f7",
	"#a14fff",
	"#5a46fa",

	"#0082ff",
	"#00a9ef",
	"#00b0ff",
	"#00bec9",
	"#00bc7b",

	"#00cb49",
	"#6ccf00",
	"#f4b100",
	"#ff9900",
	"#ff6800",

	"#ff2a39",
	"#d2b24d",
	"#ce8849",
	"#003468",
];

// blur-hash
export const defaultBlur =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA8RJREFUWEeNVwly4zAMk5z/v2+b++wvYmuHJEhCspPdTFv5SEUQBA/V39ejFXxai8tSStMf+9hF99pf+dtKDzYu+9dpp/4vgN54btAKbf0FxCaAVkoCUId9Y/eePWd2iJyVtzC1AaZ2rNo/1t+nhSCNO9cGQp/jGxQMMssM/CMOYnAArADgJ8Itdw3xFuP2G99hacRu7HVe15U5eM3wX2AgRSfGYViBLAkghCCANjyvYrLCzXz/iRd5XgOAbg5v3eswDhCrUMgOuk2psqolWQEEt/p+1AokZQDcM6FajS/qOV9bGJwZyEKNGwjzfLLr8TmMbzFRXw8Roasdni6yAsRiq947Q+4NvA+jdYJxsODsGEr6m/Wlvh73yLXwGEbbMhsTDCirU9AvnlsIxjVDEawglZyN+robAPPOjJnRGb9yP5fiz7cATGJY6Le1A+P62EhB2SoBeOzVkBufyxJAZmQDxIrYW9wBAEAMBOvBRbgOQ30KA6T68H5+BwsKQlhwYSpfrnwAcBamHVhwJjwM60zQ/HnebhaCYMC8XwJAAonMEACu/ElivytVAeTqerDYZ2YoB1TVDYBm1xj79xoEMeD5roamqRT1fAQi5oyJkfwQ4eMqDKAASfw15u+yLO/SZlntPjJCUjLSkOgXAE7/tOsEaeatUNW+p5X6uFwRgoEBNe4gEoDVAyo+Qr0woN73IMxziHGrFkgW3BXANwZGDfQMmHEBMQDgTIjy3Mdf/bifL9Z0tQxT/jsDyoJlAYswav4XACFED8FGSa638zkrodeAWfJfPDfv7TrLs9d/K8EiQMoA6KArStGMqBug/9Tb6WzdPhgQFrgGDPH3xqW6AgAPAa1jGoZusw2YH9fTKUSoIFT1BiKqoFZGiT26pdbQLETJAkqxh2VszYNxBXA5HqkZcQfMchzdULsiBTIYqChEVJapM36aBQDgQJUQQgwx+lzg8ac+oBGgDkh9IOcD5P+HYUQBnA8GIOgd5oD0Pse0XoTe+735TFR6aVYcCpAzWc+HfQ6l3USUbORg2u9iDLAWuO6vZ0M+2ZjRVurpsPf5OyeeGMt8Qs55MQsaSqsLrZsNo9L35Md0jcdNAOx/VmO5HdFS8XlkSwZ4+g0mfEb4MI5DbASqlXrc//Ckb20ZhxEeQldnIQyePmp52+0YirSjk0fnrgL4E271CJ2BjeTV/q7uQo85HefTATIdbvicGQD45BNZYTrxgNkavZ2unY0g1wDxcY/D2AE4EAP9kXw4L1LkMv6oBVGbXPmJOQ51fKqiZPoLu7CiXKiHtJUAAAAASUVORK5CYII=";

export const menuListItemName = {
	allBookmarks: "All Bookmarks",
	inbox: "Inbox",
	trash: "Trash",
	settings: "Settings",
	image: "Image",
	videos: "Videos",
	links: "Links",
	documents: "Documents",
};
