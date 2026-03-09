import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MY_LISTS, GET_MY_RECIPIENTS } from "../utils/queries";
import { ADD_ITEM_TO_REC, ADD_ITEM_TO_ALL_RECS_ON_LIST } from "../utils/mutations";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export default function AddToListModal({ isOpen, onClose, productToAdd, modalGiftRoute }) {
	const { data, loading, error } = useQuery(GET_MY_LISTS);
	const { data: recData, loading: recLoading, error: recError } = useQuery(GET_MY_RECIPIENTS);

	const [addItemToRec] = useMutation(ADD_ITEM_TO_REC);
	const [addItemToAllRecs] = useMutation(ADD_ITEM_TO_ALL_RECS_ON_LIST);

	const [userLists, setUserLists] = useState([]);
	const [recList, setRecList] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");

	useEffect(() => {
		if (data?.getMyLists) setUserLists(data.getMyLists);
		if (recData?.getMyRecipients) setRecList(recData.getMyRecipients);
	}, [data, recData]);

	useEffect(() => {
		if (isOpen) {
			setSelectedId("");
			setSuccessMsg("");
		}
	}, [isOpen]);

	if (!isOpen) return null;
	if (loading || recLoading) return <div className="modal-overlay"><CircularProgress /></div>;
	if (error || recError) {
		return (
			<div className="modal-overlay" onClick={onClose}>
				<div className="modal" onClick={(e) => e.stopPropagation()}>
					<Typography color="error">Error loading data</Typography>
					<button onClick={onClose}>Close</button>
				</div>
			</div>
		);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedId || !productToAdd) return;
		setSubmitting(true);

		try {
			if (modalGiftRoute === "list") {
				await addItemToAllRecs({
					variables: { listId: selectedId, ebayItemId: productToAdd.itemId },
				});
				const listName = userLists.find((l) => l._id === selectedId)?.listName;
				setSuccessMsg(`Added to all recipients on "${listName}"!`);
			} else {
				await addItemToRec({
					variables: { recId: selectedId, ebayItemId: productToAdd.itemId },
				});
				const recName = recList.find((r) => r._id === selectedId)?.firstName;
				setSuccessMsg(`Added to ${recName}!`);
			}
			setTimeout(() => onClose(), 1200);
		} catch (err) {
			console.error("Error adding item:", err);
			setSuccessMsg("");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={(e) => e.stopPropagation()}>
				{successMsg ? (
					<Typography sx={{ color: "green", fontWeight: "bold", textAlign: "center", py: 2 }}>
						{successMsg}
					</Typography>
				) : (
					<>
						<h2>{modalGiftRoute === "list" ? "Add to All on List" : "Choose a Recipient"}</h2>
						<form onSubmit={handleSubmit}>
							<select
								value={selectedId}
								onChange={(e) => setSelectedId(e.target.value)}
								required
							>
								<option value="">
									{modalGiftRoute === "list" ? "Select a list" : "Choose recipient"}
								</option>
								{modalGiftRoute === "list"
									? userLists.map((list) => (
										<option key={list._id} value={list._id}>
											{list.listName} ({list.recipients?.length || 0} recipients)
										</option>
									))
									: recList.map((rec) => (
										<option key={rec._id} value={rec._id}>
											{rec.firstName} {rec.lastName}
										</option>
									))}
							</select>
							<button type="submit" disabled={submitting || !selectedId}>
								{submitting ? "Adding..." : modalGiftRoute === "list" ? "Add to All Recipients" : "Add Gift"}
							</button>
						</form>
						<button onClick={onClose}>Close</button>
					</>
				)}
			</div>
		</div>
	);
}
