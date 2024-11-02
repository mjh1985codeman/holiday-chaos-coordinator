import React, { useState, useEffect } from "react";

import { useQuery, useMutation } from "@apollo/client";

import { GET_ME } from "../utils/queries";

//addToCart Functionality global.

const Lists = () => {
	const { data, loading } = useQuery(GET_ME);
	const userData = data?.me || {};


	useEffect(() => {
		if (!loading && userData) {
			console.log('userData here: ' , userData);
		}
	}, [userData, loading]);

	if (loading) {
		return <h2>Loading...</h2>;
	}

	return (
		<>
            <h1>List Componenent Here.</h1>
		</>
	);
};

export default Lists;
