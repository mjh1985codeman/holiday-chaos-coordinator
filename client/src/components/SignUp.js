import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

import Auth from "../utils/auth";
import { ADD_USER } from "../utils/mutations";
import { useMutation } from "@apollo/client";

const SignUp = () => {
	const [userFormData, setUserFormData] = useState({
		firstName: "",
		email: "",
		password: "",
	});

	const [showAlert, setShowAlert] = useState(false);

	const [createUser] = useMutation(ADD_USER);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setUserFormData({ ...userFormData, [name]: value });
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		try {
			const { data } = await createUser({
				variables: { ...userFormData },
			});

			Auth.login(data.addUser.token);
		} catch (err) {
			console.error(err);
			setShowAlert(true);
		}

		setUserFormData({
			firstName: "",
			email: "",
			password: "",
		});
	};

	return (
		<div className="login-style">
			<Collapse in={showAlert}>
				<Alert
					severity="error"
					onClose={() => setShowAlert(false)}
					sx={{ mb: 2 }}
				>
					There was a problem with signing up! Please try again!
				</Alert>
			</Collapse>
			<form onSubmit={handleFormSubmit}>
				<TextField
					label="First Name"
					type="text"
					name="firstName"
					placeholder="First Name"
					onChange={handleInputChange}
					value={userFormData.firstName}
					required
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Email"
					type="email"
					name="email"
					placeholder="Email"
					onChange={handleInputChange}
					value={userFormData.email}
					required
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Password"
					type="password"
					name="password"
					placeholder="Password"
					onChange={handleInputChange}
					value={userFormData.password}
					required
					fullWidth
					margin="normal"
				/>
				<div className="btn-div">
					<Button
						disabled={
							!(
								userFormData.firstName &&
								userFormData.email &&
								userFormData.password
							)
						}
						type="submit"
						variant="contained"
					>
						Submit
					</Button>
				</div>
			</form>
		</div>
	);
};

export default SignUp;
