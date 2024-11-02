import React from "react";
import Auth from "../utils/auth";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import ReorderIcon from "@mui/icons-material/Reorder";
import { useNavigate } from 'react-router-dom';

// import Auth from "../utils/auth";

const NavBar = () => {
	const navigate = useNavigate();

	return (
		<>
			<Paper elevation={3} className="nav-paper">
				{/* Search */}
				<BottomNavigation showLabels className="cust-nav">
					<BottomNavigationAction
						icon={<SearchIcon fontSize="large"/>} // Use sx for styling
						className="cust-nav-text"
						onClick={() => navigate("/")}
						label="Search"

					/>
					{/* Lists */}
					{Auth.loggedIn() ? (
						<BottomNavigationAction

							onClick={() => navigate("/lists")}
							label="Your Lists"
							className="cust-nav-text"
							icon={<ReorderIcon fontSize="large"/>} 
						/>
					) : null}
					{/* Sign Up */}
					{Auth.loggedIn() ? null : (
						<BottomNavigationAction
							onClick={() => navigate("/signup")}
							label="Sign Up"
							className="cust-nav-text"
							icon={<AssignmentIcon fontSize="large"/>} 
						/>
					)}
					{/* Log Out */}

					{Auth.loggedIn() ? (
						<BottomNavigationAction
							onClick={() => Auth.logout()}
							label="Logout"
							className="cust-nav-text"
							icon={<LogoutIcon fontSize="large"/>} 
						/>
					) : (
						// Log In
						<BottomNavigationAction
							onClick={() => navigate("/login")}
							label="Login"
							className="cust-nav-text"
							icon={<LoginIcon fontSize="large"/>} 
						/>
					)}
				</BottomNavigation>
			</Paper>
		</>
	);
};

export default NavBar;
