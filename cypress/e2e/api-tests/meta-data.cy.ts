//@ts-nocheck

describe("Meta data testing", () => {
	beforeEach(() => {
		// cy.visit("/all-bookmarks");
		cy.visit("/login");
	});

	// it("bookmark meta_data check", async () => {
	// 	cy.login(
	// 		Cypress.env("test_email") as string,
	// 		// "test@test.com",
	// 		Cypress.env("test_password") as string,
	// 	);

	// 	cy.request(`/api/bookmark/add-bookmark-min-data`, {
	// 		category_id: 0,
	// 		update_access: true,
	// 		url: "https://unsplash.com/photos/a-city-street-with-a-lot-of-tall-buildings-badrIRxBqmk",
	// 	}).as("addRequest");

	// 	let bookmarkId;

	// cy.get("@addRequest")?.then((addBookmarkData) => {
	// 	bookmarkId = addBookmarkData?.body?.data?.[0]?.id;

	// 	// check meta data

	// 	cy.reload();

	// 	cy.wait(40000);

	// 	cy.request(`/api/v1/bookmarks/get/fetch-by-id`, {
	// 		data: {
	// 			id: addBookmarkData?.body?.data?.[0]?.id,
	// 		},
	// 	}).as("fetchRequest");

	// 	cy.get("@fetchRequest").then((data) => {
	// 		expect(data?.body?.data?.[0]?.meta_data).to.not.be.null;
	// 		expect(data?.body?.data?.[0]?.meta_data?.ocr).to.not.be.null;
	// 		expect(data?.body?.data?.[0]?.meta_data?.img_caption).to.not.be.null;
	// 		expect(data?.body?.data?.[0]?.meta_data?.ogImgBlurUrl).to.not.be.null;
	// 	});

	// 		// delete the bookmark
	// 		cy.request(`/api/bookmark/delete-bookmark`, {
	// 			data: {
	// 				deleteData: [
	// 					{
	// 						id: addBookmarkData?.body?.data?.[0]?.id,
	// 						ogImage: addBookmarkData?.body?.data?.[0]?.ogImage,
	// 						title: addBookmarkData?.body?.data?.[0]?.title,
	// 						url: addBookmarkData?.body?.data?.[0]?.url,
	// 					},
	// 				],
	// 			},
	// 		});
	// 	});
	// });

	it("file upload check", async () => {
		cy.wait(3000);

		cy.login(
			Cypress.env("test_email") as string,
			// "test@test.com",
			Cypress.env("test_password") as string,
		);

		const headers = {
			Accept: "application/json",
			"Content-Type": "application/json",
		};
		cy.request({
			method: "POST",
			url: "/api/v1/tests/file/post/upload", // Ensure this URL is correct
			body: {
				name: "image.png",
				type: "image/png",
				uploadFileNamePath: "m05d1s11-image.png",
			},
			headers: headers,
		}).as("uploadRequest");

		cy.get("@uploadRequest")?.then((addBookmarkData) => {
			bookmarkId = addBookmarkData?.body?.data?.[0]?.id;

			// check meta data

			cy.reload();

			cy.wait(40000);

			cy.request(`/api/v1/bookmarks/get/fetch-by-id`, {
				data: {
					id: addBookmarkData?.body?.data?.[0]?.id,
				},
			}).as("fetchRequest");

			cy.get("@fetchRequest").then((data) => {
				cy.wait(1000);

				expect(data?.body?.data?.[0]?.meta_data).to.not.be.null;
				expect(data?.body?.data?.[0]?.meta_data?.ocr).to.not.be.null;
				expect(data?.body?.data?.[0]?.meta_data?.img_caption).to.not.be.null;
				expect(data?.body?.data?.[0]?.meta_data?.ogImgBlurUrl).to.not.be.null;
			});

			// delete the bookmark

			// click del icon for 1st bookmark in list
			cy.get(
				".my-masonry-grid_column:first-child .single-bookmark:first-child .helper-icons figure:nth-child(2)",
			).click();

			cy.wait(5000);

			// go to trash page
			cy.get(`[href="/trash"]`).click();

			// clear the trash
			cy.get("#clear-trash-button").click();
			cy.get("#warning-button").click();

			cy.wait(1000);

			// cy.request(`/api/bookmark/delete-bookmark`, {
			// 	data: {
			// 		deleteData: [
			// 			{
			// 				id: addBookmarkData?.body?.data?.[0]?.id,
			// 				ogImage: addBookmarkData?.body?.data?.[0]?.ogImage,
			// 				title: addBookmarkData?.body?.data?.[0]?.title,
			// 				url: addBookmarkData?.body?.data?.[0]?.url,
			// 			},
			// 		],
			// 	},
			// });
		});
	});

	// it("tweet upload check", async () => {
	// 	cy.wait(3000);

	// 	cy.login(
	// 		Cypress.env("test_email") as string,
	// 		// "test@test.com",
	// 		Cypress.env("test_password") as string,
	// 	);

	// 	cy.request("POST", `/api/v1/twitter/sync`, {
	// 		data: [
	// 			{
	// 				description: "test tweet description",
	// 				ogImage: "https://pbs.twimg.com/media/GVRv2bGWcAA--aC.jpg",
	// 				title: "test title",
	// 				type: "tweet",
	// 				url: "https://x.com/passportprofit/status/1825206734966710682",
	// 				meta_data: {
	// 					twitter_avatar_url: "test url",
	// 				},
	// 				inserted_at: "2024-08-22T14:30:00Z",
	// 				sort_index: "89",
	// 			},
	// 		],
	// 	}).as("addRequest");

	// 	let bookmarkId;

	// 	cy.get("@addRequest")?.then((addBookmarkData) => {
	// 		bookmarkId = addBookmarkData?.body?.data?.[0]?.id;

	// 		// check meta data

	// 		cy.reload();

	// 		cy.wait(40000);

	// 		cy.request(`/api/v1/bookmarks/get/fetch-by-id`, {
	// 			data: {
	// 				id: addBookmarkData?.body?.data?.[0]?.id,
	// 			},
	// 		}).as("fetchRequest");

	// 		cy.get("@fetchRequest").then((data) => {
	// 			expect(data?.body?.data?.[0]?.meta_data).to.not.be.null;
	// 			expect(data?.body?.data?.[0]?.meta_data?.ocr).to.not.be.null;
	// 			expect(data?.body?.data?.[0]?.meta_data?.img_caption).to.not.be.null;
	// 			expect(data?.body?.data?.[0]?.meta_data?.ogImgBlurUrl).to.not.be.null;
	// 		});

	// 		// delete the bookmark
	// 		cy.request(`/api/bookmark/delete-bookmark`, {
	// 			data: {
	// 				deleteData: [
	// 					{
	// 						id: addBookmarkData?.body?.data?.[0]?.id,
	// 						ogImage: addBookmarkData?.body?.data?.[0]?.ogImage,
	// 						title: addBookmarkData?.body?.data?.[0]?.title,
	// 						url: addBookmarkData?.body?.data?.[0]?.url,
	// 					},
	// 				],
	// 			},
	// 		});
	// 	});
	// });
});
