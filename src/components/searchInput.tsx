import React from "react";
import { type PostgrestError } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { Mention, MentionsInput } from "react-mentions";

import SearchInputSearchIcon from "../icons/searchInputSearchIcon";
import {
	useLoadersStore,
	useMiscellaneousStore,
} from "../store/componentStore";
import { type UserTagsData } from "../types/apiTypes";
import { USER_TAGS_KEY } from "../utils/constants";

import Spinner from "./spinner";

const styles = {
	input: {
		left: 27,
		top: 3,
		width: "90%",
	},
	control: {
		backgroundColor: "rgba(0, 0, 0, 0.047)",
		fontSize: 14,
		fontWeight: 400,
		color: "#707070",

		width: 300,
		padding: "3px 10px 3px 28px",
		borderRadius: 8,
	},
	"&multiLine": {
		control: {},
		highlighter: {},
		input: {
			border: "unset",
			borderRadius: 8,
			padding: "inherit",
			outline: "unset",
		},
	},

	suggestions: {
		list: {
			// backgroundColor: "#FFFFFF",
			padding: "6px",
			boxShadow:
				"0px 0px 1px rgba(0, 0, 0, 0.19), 0px 1px 2px rgba(0, 0, 0, 0.07), 0px 6px 15px -5px rgba(0, 0, 0, 0.11)",
			borderRadius: "12px",
			// border: "1px solid rgba(0,0,0,0.15)",
			// fontSize: 14,
		},
		item: {
			padding: "7px 8px",
			borderRadius: "8px",
			fontWeight: "450",
			fontSize: "13px",
			lineHeight: "15px",
			color: "#383838",

			// borderBottom: "1px solid rgba(0,0,0,0.15)",
			"&focused": {
				backgroundColor: "#EDEDED",
			},
		},
	},
};

type SearchInputTypes = {
	onChange: (value: string) => void;
	placeholder: string;
	userId: string;
};

const SearchInput = (props: SearchInputTypes) => {
	const { placeholder, onChange, userId } = props;

	const queryClient = useQueryClient();

	const searchText = useMiscellaneousStore((state) => state.searchText);
	const isSearchLoading = useLoadersStore((state) => state.isSearchLoading);

	const userTagsData = queryClient.getQueryData([USER_TAGS_KEY, userId]) as {
		data: UserTagsData[];
		error: PostgrestError;
	};

	return (
		<div className=" relative">
			<figure className=" absolute left-[9px] top-[7px]">
				<SearchInputSearchIcon />
			</figure>
			{/* // classname added to remove default focus-visible style */}
			<MentionsInput
				// eslint-disable-next-line tailwindcss/no-custom-classname
				className="search-bar"
				onChange={(event: { target: { value: string } }) => {
					onChange(event.target.value);
				}}
				placeholder={placeholder}
				singleLine
				style={styles}
				value={searchText}
			>
				<Mention
					appendSpaceOnAdd
					data={userTagsData?.data?.map((item) => ({
						id: item?.id,
						display: item?.name,
					}))}
					displayTransform={(_url, display) => `#${display}`}
					markup="@__display__"
					trigger="#"
				/>
			</MentionsInput>
			{isSearchLoading && (
				<div className=" absolute right-2 top-0">
					<Spinner />
				</div>
			)}
		</div>
	);
};

export default SearchInput;
