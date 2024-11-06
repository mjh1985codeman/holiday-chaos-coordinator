import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_MY_LISTS } from "../utils/queries";

const Lists = () => {
	const { data, loading, error } = useQuery(GET_MY_LISTS);
	const [userLists, setUserLists] = useState([]);

	useEffect(() => {
		if (data && data.getMyLists) {
			setUserLists(data.getMyLists);
		}
	}, [data]);

	if (loading) {
		return <h2>Loading...</h2>;
	}

	if (error) {
		return <p>Error: {error.message}</p>;
	}

	return (
		<>
			<h2>My Lists</h2>
			{userLists.map((list) => (
				<div key={list._id}>
					<h3>{list.listName}</h3>
					<button>View List</button>
					<button>Edit List</button>
					<button>Delete List</button>
				</div>
			))}
		</>
	);
};

export default Lists;

