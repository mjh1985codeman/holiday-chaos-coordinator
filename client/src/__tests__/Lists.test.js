import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter } from "react-router-dom";
import Lists from "../components/Lists";
import { GET_MY_LISTS } from "../utils/queries";
import { CREATE_LIST } from "../utils/mutations";

const emptyMock = [
	{
		request: { query: GET_MY_LISTS },
		result: { data: { getMyLists: [] } },
	},
];

const withListsMock = [
	{
		request: { query: GET_MY_LISTS },
		result: {
			data: {
				getMyLists: [
					{
						_id: "list1",
						listName: "Family",
						recipients: [
							{
								_id: "rec1",
								firstName: "Mom",
								lastName: "Smith",
								products: [
									{ itemId: "i1", itemName: "Scarf", price: "25.00" },
									{ itemId: "i2", itemName: "Book", price: "15.00" },
								],
							},
						],
					},
					{
						_id: "list2",
						listName: "Friends",
						recipients: [],
					},
				],
			},
		},
	},
];

const renderLists = (mocks) =>
	render(
		<MockedProvider mocks={mocks} addTypename={false}>
			<BrowserRouter>
				<Lists />
			</BrowserRouter>
		</MockedProvider>
	);

describe("Lists component", () => {
	it("shows loading state initially", () => {
		renderLists(emptyMock);
		expect(screen.getByRole("progressbar")).toBeInTheDocument();
	});

	it("shows empty state message when no lists", async () => {
		renderLists(emptyMock);
		await waitFor(() => {
			expect(screen.getByText(/no lists yet/i)).toBeInTheDocument();
		});
	});

	it("renders lists with names and totals", async () => {
		renderLists(withListsMock);
		await waitFor(() => {
			expect(screen.getByText("Family")).toBeInTheDocument();
			expect(screen.getByText("Friends")).toBeInTheDocument();
		});
		expect(screen.getByText(/1 recipient \| Total: \$40\.00/)).toBeInTheDocument();
		expect(screen.getByText(/0 recipients \| Total: \$0\.00/)).toBeInTheDocument();
	});

	it("shows grand total bar", async () => {
		renderLists(withListsMock);
		await waitFor(() => {
			expect(screen.getByText(/Grand Total: \$40\.00/)).toBeInTheDocument();
		});
	});

	it("renders create list form", async () => {
		renderLists(emptyMock);
		await waitFor(() => {
			expect(screen.getByLabelText(/new list name/i)).toBeInTheDocument();
		});
		expect(screen.getByRole("button", { name: /create list/i })).toBeInTheDocument();
	});

	it("create list button is disabled when input is empty", async () => {
		renderLists(emptyMock);
		await waitFor(() => {
			expect(screen.getByRole("button", { name: /create list/i })).toBeDisabled();
		});
	});
});
