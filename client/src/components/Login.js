import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { useMutation } from "@apollo/client";

import Auth from "../utils/auth";
import { LOGIN_USER } from "../utils/mutations";

const Login = () => {
  const [userFormData, setUserFormData] = useState({
    email: "",
    password: "",
  });
  const [showAlert, setShowAlert] = useState(false);

  const [loginUser] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await loginUser({
        variables: { ...userFormData },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
      setShowAlert(true);
    }

    setUserFormData({
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
          Something went wrong with your login credentials!
        </Alert>
      </Collapse>
      <form onSubmit={handleFormSubmit}>
        <TextField
          label="Email"
          type="email"
          name="email"
          placeholder="Your email"
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
          placeholder="Your password"
          onChange={handleInputChange}
          value={userFormData.password}
          required
          fullWidth
          margin="normal"
        />
        <div className="btn-div">
          <Button
            disabled={!(userFormData.email && userFormData.password)}
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

export default Login;
