import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter } from "react-router-dom";
import Login from "../components/Login";
import { LOGIN_USER } from "../utils/mutations";

const mocks = [
	{
		request: {
			query: LOGIN_USER,
			variables: { email: "test@test.com", password: "password123" },
		},
		result: {
			data: {
				login: {
					token: "mock-token",
					user: { _id: "1", firstName: "Test" },
				},
			},
		},
	},
];

const renderLogin = () =>
	render(
		<MockedProvider mocks={mocks} addTypename={false}>
			<BrowserRouter>
				<Login />
			</BrowserRouter>
		</MockedProvider>
	);

describe("Login component", () => {
	it("renders email and password fields", () => {
		renderLogin();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
	});

	it("renders a submit button", () => {
		renderLogin();
		expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
	});

	it("submit button is disabled when fields are empty", () => {
		renderLogin();
		expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
	});

	it("submit button enables when fields are filled", () => {
		renderLogin();
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});
		expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();
	});
});
