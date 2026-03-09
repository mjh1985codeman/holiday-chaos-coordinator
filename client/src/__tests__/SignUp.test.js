import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter } from "react-router-dom";
import SignUp from "../components/SignUp";

const renderSignUp = () =>
	render(
		<MockedProvider mocks={[]} addTypename={false}>
			<BrowserRouter>
				<SignUp />
			</BrowserRouter>
		</MockedProvider>
	);

describe("SignUp component", () => {
	it("renders all form fields", () => {
		renderSignUp();
		expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
	});

	it("renders a submit button", () => {
		renderSignUp();
		expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
	});

	it("submit button is disabled when fields are empty", () => {
		renderSignUp();
		expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
	});

	it("submit button enables when all fields are filled", () => {
		renderSignUp();
		fireEvent.change(screen.getByLabelText(/first name/i), {
			target: { value: "John" },
		});
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "john@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "pass123" },
		});
		expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();
	});
});
