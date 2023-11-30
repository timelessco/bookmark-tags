import { useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { type PostgrestError } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";

import useGetCurrentUrlPath from "../../../hooks/useGetCurrentUrlPath";
import HomeIconGray from "../../../icons/homeIconGray";
import InboxIconGray from "../../../icons/inboxIconGray";
import SearchIconGray from "../../../icons/searchIconGray";
import SettingsIcon from "../../../icons/settingsIcon";
import TrashIconGray from "../../../icons/trashIconGray";
import { useModalStore } from "../../../store/componentStore";
import { type BookmarksCountTypes } from "../../../types/apiTypes";
import {
	ALL_BOOKMARKS_URL,
	BOOKMARKS_COUNT_KEY,
	SEARCH_URL,
	TRASH_URL,
	UNCATEGORIZED_URL,
} from "../../../utils/constants";

import SingleListItemComponent from "./singleListItemComponent";

const SidePaneOptionsMenu = () => {
	const currentPath = useGetCurrentUrlPath();
	const queryClient = useQueryClient();
	const session = useSession();
	const SingleListItem = useCallback(SingleListItemComponent, []);

	const bookmarksCountData = queryClient.getQueryData([
		BOOKMARKS_COUNT_KEY,
		session?.user?.id,
	]) as {
		data: BookmarksCountTypes;
		error: PostgrestError;
	};

	const toggleShowSettingsModal = useModalStore(
		(state) => state.toggleShowSettingsModal,
	);

	const optionsMenuList = [
		{
			icon: <SearchIconGray />,
			name: "Search",
			href: `/${SEARCH_URL}`,
			current: currentPath === SEARCH_URL,
			id: 0,
			count: undefined,
			iconColor: "",
		},
		{
			icon: <InboxIconGray />,
			name: "Inbox",
			href: `/${UNCATEGORIZED_URL}`,
			current: currentPath === UNCATEGORIZED_URL,
			id: 2,
			count: bookmarksCountData?.data?.uncategorized,
			iconColor: "",
		},
		{
			icon: <HomeIconGray />,
			name: "All",
			href: `/${ALL_BOOKMARKS_URL}`,
			current: currentPath === ALL_BOOKMARKS_URL,
			id: 1,
			count: bookmarksCountData?.data?.allBookmarks,
			iconColor: "",
		},

		{
			icon: <TrashIconGray />,
			name: "Trash",
			href: `/${TRASH_URL}`,
			current: currentPath === TRASH_URL,
			id: 3,
			count: bookmarksCountData?.data?.trash,
			iconColor: "",
		},
		{
			icon: <SettingsIcon />,
			name: "Settings",
			href: "",
			current: false,
			id: 4,
			count: undefined,
			iconColor: "",
		},
	];

	return (
		<div className="pt-[10px]">
			{optionsMenuList?.map((item) => (
				<SingleListItem
					extendedClassname="py-[6px]"
					isLink={item?.id !== 4}
					item={item}
					key={item.id}
					onClick={() => {
						if (item?.id === 4) {
							// we clicked on settings
							toggleShowSettingsModal();
						}
					}}
					showIconDropdown={false}
				/>
			))}
		</div>
	);
};

export default SidePaneOptionsMenu;
