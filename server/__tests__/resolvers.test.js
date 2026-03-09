const resolvers = require("../schemas/resolvers");

jest.mock("../models", () => {
	const mockUser = {
		findOne: jest.fn(),
		findOneAndUpdate: jest.fn(),
		create: jest.fn(),
	};
	const mockList = {
		find: jest.fn(),
		findOne: jest.fn(),
		findById: jest.fn(),
		findOneAndUpdate: jest.fn(),
		findByIdAndUpdate: jest.fn(),
		findByIdAndDelete: jest.fn(),
		create: jest.fn(),
	};
	const mockRecipient = {
		find: jest.fn(),
		findById: jest.fn(),
		findByIdAndUpdate: jest.fn(),
		findByIdAndDelete: jest.fn(),
		create: jest.fn(),
		deleteMany: jest.fn(),
		updateMany: jest.fn(),
	};
	return { User: mockUser, List: mockList, Recipient: mockRecipient };
});

jest.mock("../utils/auth", () => ({
	signToken: jest.fn(() => "mock-token"),
}));

jest.mock("../utils/ebayapi", () => ({
	getProducts: jest.fn(),
	getProductByItemId: jest.fn(),
}));

const { User, List, Recipient } = require("../models");
const { signToken } = require("../utils/auth");
const { getProducts, getProductByItemId } = require("../utils/ebayapi");

const mockContext = { user: { _id: "user123" } };
const noAuthContext = {};

describe("Query resolvers", () => {
	beforeEach(() => jest.clearAllMocks());

	describe("me", () => {
		it("returns user data when authenticated", async () => {
			const mockUserData = { _id: "user123", firstName: "John", email: "john@test.com" };
			User.findOne.mockReturnValue({
				select: jest.fn().mockReturnValue({
					populate: jest.fn().mockResolvedValue(mockUserData),
				}),
			});

			const result = await resolvers.Query.me(null, {}, mockContext);
			expect(result).toEqual(mockUserData);
			expect(User.findOne).toHaveBeenCalledWith({ _id: "user123" });
		});

		it("throws when not authenticated", async () => {
			await expect(resolvers.Query.me(null, {}, noAuthContext))
				.rejects.toThrow("You must be logged in.");
		});
	});

	describe("getMyLists", () => {
		it("returns lists for the authenticated user", async () => {
			const mockLists = [
				{ _id: "list1", listName: "Family", recipients: [] },
				{ _id: "list2", listName: "Friends", recipients: [] },
			];
			List.find.mockReturnValue({
				populate: jest.fn().mockResolvedValue(mockLists),
			});

			const result = await resolvers.Query.getMyLists(null, {}, mockContext);
			expect(result).toEqual(mockLists);
			expect(List.find).toHaveBeenCalledWith({ listUser: "user123" });
		});

		it("throws when not authenticated", async () => {
			await expect(resolvers.Query.getMyLists(null, {}, noAuthContext))
				.rejects.toThrow("You must be logged in.");
		});
	});

	describe("getListById", () => {
		it("returns a single list by id", async () => {
			const mockList = { _id: "list1", listName: "Family", recipients: [] };
			List.findOne.mockReturnValue({
				populate: jest.fn().mockResolvedValue(mockList),
			});

			const result = await resolvers.Query.getListById(null, { listId: "list1" }, mockContext);
			expect(result).toEqual(mockList);
			expect(List.findOne).toHaveBeenCalledWith({ _id: "list1", listUser: "user123" });
		});

		it("throws when list not found", async () => {
			List.findOne.mockReturnValue({
				populate: jest.fn().mockResolvedValue(null),
			});
			await expect(resolvers.Query.getListById(null, { listId: "bad" }, mockContext))
				.rejects.toThrow("List not found.");
		});
	});

	describe("getRecipientById", () => {
		it("returns a recipient", async () => {
			const mockRec = { _id: "rec1", firstName: "Jane", lastName: "Doe", products: [] };
			Recipient.findById.mockResolvedValue(mockRec);

			const result = await resolvers.Query.getRecipientById(null, { recId: "rec1" }, mockContext);
			expect(result).toEqual(mockRec);
		});

		it("throws when recipient not found", async () => {
			Recipient.findById.mockResolvedValue(null);
			await expect(resolvers.Query.getRecipientById(null, { recId: "bad" }, mockContext))
				.rejects.toThrow("Recipient not found.");
		});
	});

	describe("getEbayProducts", () => {
		it("returns mapped products", async () => {
			getProducts.mockResolvedValue({
				itemSummaries: [
					{
						itemId: "item1",
						title: "Widget",
						price: { value: "9.99" },
						image: { imageUrl: "http://img.com/1.jpg" },
						additionalImages: [],
						itemWebUrl: "http://ebay.com/item1",
						seller: { username: "seller1", feedbackPercentage: "99" },
						condition: "New",
					},
				],
			});

			const result = await resolvers.Query.getEbayProducts(null, { product: "widget" });
			expect(result).toHaveLength(1);
			expect(result[0].itemId).toBe("item1");
			expect(result[0].itemName).toBe("Widget");
			expect(result[0].price).toBe("9.99");
		});

		it("returns empty array when no results", async () => {
			getProducts.mockResolvedValue({});
			const result = await resolvers.Query.getEbayProducts(null, { product: "nothing" });
			expect(result).toEqual([]);
		});
	});
});

describe("Mutation resolvers", () => {
	beforeEach(() => jest.clearAllMocks());

	describe("addUser", () => {
		it("creates a user and returns token", async () => {
			const mockUser = { _id: "user1", firstName: "John", email: "john@test.com" };
			User.create.mockResolvedValue(mockUser);

			const result = await resolvers.Mutation.addUser(null, {
				firstName: "John",
				email: "john@test.com",
				password: "pass123",
			});
			expect(result.token).toBe("mock-token");
			expect(result.user).toEqual(mockUser);
			expect(signToken).toHaveBeenCalledWith(mockUser);
		});
	});

	describe("createList", () => {
		it("creates a list and links to user", async () => {
			const mockList = { _id: "list1", listName: "Family", listUser: "user123" };
			List.create.mockResolvedValue(mockList);
			User.findOneAndUpdate.mockResolvedValue({});

			const result = await resolvers.Mutation.createList(null, { listName: "Family" }, mockContext);
			expect(result).toEqual(mockList);
			expect(List.create).toHaveBeenCalledWith({ listName: "Family", listUser: "user123" });
			expect(User.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: "user123" },
				{ $push: { lists: "list1" } },
				{ new: true }
			);
		});

		it("throws when not authenticated", async () => {
			await expect(resolvers.Mutation.createList(null, { listName: "Family" }, noAuthContext))
				.rejects.toThrow("You must be logged in.");
		});
	});

	describe("updateList", () => {
		it("updates list name", async () => {
			const updated = { _id: "list1", listName: "Close Friends", recipients: [] };
			List.findOneAndUpdate.mockReturnValue({
				populate: jest.fn().mockResolvedValue(updated),
			});

			const result = await resolvers.Mutation.updateList(
				null,
				{ listId: "list1", listName: "Close Friends" },
				mockContext
			);
			expect(result.listName).toBe("Close Friends");
		});

		it("throws when list not found", async () => {
			List.findOneAndUpdate.mockReturnValue({
				populate: jest.fn().mockResolvedValue(null),
			});
			await expect(
				resolvers.Mutation.updateList(null, { listId: "bad", listName: "X" }, mockContext)
			).rejects.toThrow("List not found or not authorized.");
		});
	});

	describe("deleteList", () => {
		it("deletes list and its recipients", async () => {
			const mockList = { _id: "list1", listName: "Family", recipients: ["rec1", "rec2"] };
			List.findOne.mockResolvedValue(mockList);
			Recipient.deleteMany.mockResolvedValue({});
			List.findByIdAndDelete.mockResolvedValue(mockList);
			User.findOneAndUpdate.mockResolvedValue({});

			const result = await resolvers.Mutation.deleteList(null, { listId: "list1" }, mockContext);
			expect(result).toEqual(mockList);
			expect(Recipient.deleteMany).toHaveBeenCalledWith({ _id: { $in: ["rec1", "rec2"] } });
			expect(User.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: "user123" },
				{ $pull: { lists: "list1" } }
			);
		});
	});

	describe("createRecipient", () => {
		it("creates recipient and adds to list", async () => {
			const mockList = { _id: "list1", listName: "Family", listUser: "user123" };
			const mockRec = { _id: "rec1", firstName: "Jane", lastName: "Doe" };
			const updatedList = { ...mockList, recipients: [mockRec] };

			List.findOne.mockResolvedValue(mockList);
			Recipient.create.mockResolvedValue(mockRec);
			List.findByIdAndUpdate.mockReturnValue({
				populate: jest.fn().mockResolvedValue(updatedList),
			});

			const result = await resolvers.Mutation.createRecipient(
				null,
				{ firstName: "Jane", lastName: "Doe", listId: "list1" },
				mockContext
			);
			expect(result.recipients).toHaveLength(1);
			expect(Recipient.create).toHaveBeenCalledWith({
				firstName: "Jane",
				lastName: "Doe",
				listId: "list1",
			});
		});

		it("throws when list not owned by user", async () => {
			List.findOne.mockResolvedValue(null);
			await expect(
				resolvers.Mutation.createRecipient(
					null,
					{ firstName: "Jane", lastName: "Doe", listId: "list1" },
					mockContext
				)
			).rejects.toThrow("List not found or not authorized.");
		});
	});

	describe("updateRecipient", () => {
		it("updates recipient name", async () => {
			const updated = { _id: "rec1", firstName: "Janet", lastName: "Smith" };
			Recipient.findByIdAndUpdate.mockResolvedValue(updated);

			const result = await resolvers.Mutation.updateRecipient(
				null,
				{ recId: "rec1", firstName: "Janet", lastName: "Smith" },
				mockContext
			);
			expect(result.firstName).toBe("Janet");
		});
	});

	describe("deleteRecipient", () => {
		it("deletes recipient and removes from list", async () => {
			const mockRec = { _id: "rec1", firstName: "Jane", lastName: "Doe" };
			Recipient.findByIdAndDelete.mockResolvedValue(mockRec);
			List.findByIdAndUpdate.mockResolvedValue({});

			const result = await resolvers.Mutation.deleteRecipient(
				null,
				{ recId: "rec1", listId: "list1" },
				mockContext
			);
			expect(result).toEqual(mockRec);
			expect(List.findByIdAndUpdate).toHaveBeenCalledWith(
				"list1",
				{ $pull: { recipients: "rec1" } }
			);
		});
	});

	describe("addItemToRec", () => {
		it("fetches eBay item and adds to recipient", async () => {
			getProductByItemId.mockResolvedValue({
				itemId: "ebay1",
				title: "Gift",
				price: { value: "25.00" },
				image: { imageUrl: "http://img.com/gift.jpg" },
				itemWebUrl: "http://ebay.com/ebay1",
				seller: { username: "seller1", feedbackPercentage: "99" },
				condition: "New",
			});
			const updatedRec = {
				_id: "rec1",
				products: [{ itemId: "ebay1", itemName: "Gift", price: "25.00" }],
			};
			Recipient.findByIdAndUpdate.mockResolvedValue(updatedRec);

			const result = await resolvers.Mutation.addItemToRec(
				null,
				{ recId: "rec1", ebayItemId: "ebay1" },
				mockContext
			);
			expect(result.products).toHaveLength(1);
			expect(result.products[0].itemId).toBe("ebay1");
		});
	});

	describe("addItemToAllRecsOnList", () => {
		it("adds item to all recipients on a list", async () => {
			const mockList = { _id: "list1", listUser: "user123", recipients: ["rec1", "rec2"] };
			List.findOne.mockResolvedValue(mockList);
			getProductByItemId.mockResolvedValue({
				itemId: "ebay1",
				title: "Gift",
				price: { value: "10.00" },
				image: { imageUrl: "http://img.com/g.jpg" },
				itemWebUrl: "http://ebay.com/ebay1",
				seller: { username: "s1", feedbackPercentage: "98" },
				condition: "New",
			});
			Recipient.updateMany.mockResolvedValue({});
			const populatedList = {
				...mockList,
				recipients: [
					{ _id: "rec1", products: [{ itemId: "ebay1" }] },
					{ _id: "rec2", products: [{ itemId: "ebay1" }] },
				],
			};
			List.findById.mockReturnValue({
				populate: jest.fn().mockResolvedValue(populatedList),
			});

			const result = await resolvers.Mutation.addItemToAllRecsOnList(
				null,
				{ listId: "list1", ebayItemId: "ebay1" },
				mockContext
			);
			expect(Recipient.updateMany).toHaveBeenCalled();
			expect(result.recipients).toHaveLength(2);
		});
	});

	describe("removeItemFromRec", () => {
		it("removes item from recipient", async () => {
			const updated = { _id: "rec1", products: [] };
			Recipient.findByIdAndUpdate.mockResolvedValue(updated);

			const result = await resolvers.Mutation.removeItemFromRec(
				null,
				{ recId: "rec1", itemId: "ebay1" },
				mockContext
			);
			expect(result.products).toHaveLength(0);
		});

		it("throws when recipient not found", async () => {
			Recipient.findByIdAndUpdate.mockResolvedValue(null);
			await expect(
				resolvers.Mutation.removeItemFromRec(null, { recId: "bad", itemId: "x" }, mockContext)
			).rejects.toThrow("Recipient not found.");
		});
	});
});
