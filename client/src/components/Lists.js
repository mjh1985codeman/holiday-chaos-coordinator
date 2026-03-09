import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_MY_LISTS } from "../utils/queries";
import { CREATE_LIST, UPDATE_LIST, DELETE_LIST } from "../utils/mutations";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const Lists = () => {
	const { data, loading, error } = useQuery(GET_MY_LISTS);
	const [createList] = useMutation(CREATE_LIST, {
		refetchQueries: [{ query: GET_MY_LISTS }],
	});
	const [updateList] = useMutation(UPDATE_LIST, {
		refetchQueries: [{ query: GET_MY_LISTS }],
	});
	const [deleteList] = useMutation(DELETE_LIST, {
		refetchQueries: [{ query: GET_MY_LISTS }],
	});

	const [newListName, setNewListName] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [editName, setEditName] = useState("");
	const navigate = useNavigate();

	const handleCreateList = async (e) => {
		e.preventDefault();
		if (!newListName.trim()) return;
		try {
			await createList({ variables: { listName: newListName.trim() } });
			setNewListName("");
		} catch (err) {
			console.error("Error creating list:", err);
		}
	};

	const handleUpdate = async (listId) => {
		if (!editName.trim()) return;
		try {
			await updateList({ variables: { listId, listName: editName.trim() } });
			setEditingId(null);
			setEditName("");
		} catch (err) {
			console.error("Error updating list:", err);
		}
	};

	const handleDelete = async (listId) => {
		try {
			await deleteList({ variables: { listId } });
		} catch (err) {
			console.error("Error deleting list:", err);
		}
	};

	const calcListTotal = (recipients) => {
		if (!recipients) return "0.00";
		return recipients
			.reduce((total, rec) => {
				const recTotal = (rec.products || []).reduce(
					(sum, p) => sum + (parseFloat(p.price) || 0),
					0
				);
				return total + recTotal;
			}, 0)
			.toFixed(2);
	};

	if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
	if (error) return <Typography color="error" sx={{ m: 2 }}>Error: {error.message}</Typography>;

	const lists = data?.getMyLists || [];

	return (
		<div className="lists-container">
			<Typography variant="h4" className="lists-title">
				My Gift Lists
			</Typography>

			<form onSubmit={handleCreateList} className="create-list-form">
				<TextField
					label="New list name"
					size="small"
					value={newListName}
					onChange={(e) => setNewListName(e.target.value)}
					sx={{ flex: 1, bgcolor: "rgba(255,255,255,0.9)", borderRadius: 1 }}
				/>
				<Button
					type="submit"
					variant="contained"
					startIcon={<AddIcon />}
					disabled={!newListName.trim()}
					sx={{ bgcolor: "var(--custom-green)", "&:hover": { bgcolor: "#145a1e" } }}
				>
					Create List
				</Button>
			</form>

			{lists.length === 0 ? (
				<Typography sx={{ color: "white", textAlign: "center", mt: 4 }}>
					No lists yet. Create one above to get started!
				</Typography>
			) : (
				<div className="lists-grid">
					{lists.map((list) => (
						<div key={list._id} className="list-card">
							{editingId === list._id ? (
								<div className="list-edit-row">
									<TextField
										size="small"
										value={editName}
										onChange={(e) => setEditName(e.target.value)}
										autoFocus
										sx={{ flex: 1 }}
									/>
									<IconButton onClick={() => handleUpdate(list._id)} color="success">
										<CheckIcon />
									</IconButton>
									<IconButton onClick={() => setEditingId(null)} color="error">
										<CloseIcon />
									</IconButton>
								</div>
							) : (
								<>
									<Typography variant="h6" sx={{ fontWeight: "bold" }}>
										{list.listName}
									</Typography>
									<Typography variant="body2" sx={{ color: "#555", mb: 1 }}>
										{list.recipients?.length || 0} recipient{list.recipients?.length !== 1 ? "s" : ""}
										{" | "}
										Total: ${calcListTotal(list.recipients)}
									</Typography>
									<div className="list-card-actions">
										<Button
											size="small"
											variant="outlined"
											onClick={() => navigate(`/lists/${list._id}`)}
										>
											View
										</Button>
										<IconButton
											size="small"
											onClick={() => {
												setEditingId(list._id);
												setEditName(list.listName);
											}}
										>
											<EditIcon fontSize="small" />
										</IconButton>
										<IconButton
											size="small"
											color="error"
											onClick={() => handleDelete(list._id)}
										>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</div>
								</>
							)}
						</div>
					))}
				</div>
			)}

			{lists.length > 0 && (
				<div className="grand-total-bar">
					<Typography variant="h6">
						Grand Total: $
						{lists
							.reduce((sum, list) => sum + parseFloat(calcListTotal(list.recipients)), 0)
							.toFixed(2)}
					</Typography>
				</div>
			)}
		</div>
	);
};

export default Lists;
