import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_LIST_BY_ID } from "../utils/queries";
import { CREATE_RECIPIENT, UPDATE_RECIPIENT, DELETE_RECIPIENT } from "../utils/mutations";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const ListDetail = () => {
	const { listId } = useParams();
	const navigate = useNavigate();
	const { data, loading, error } = useQuery(GET_LIST_BY_ID, {
		variables: { listId },
	});

	const [createRecipient] = useMutation(CREATE_RECIPIENT, {
		refetchQueries: [{ query: GET_LIST_BY_ID, variables: { listId } }],
	});
	const [updateRecipient] = useMutation(UPDATE_RECIPIENT, {
		refetchQueries: [{ query: GET_LIST_BY_ID, variables: { listId } }],
	});
	const [deleteRecipient] = useMutation(DELETE_RECIPIENT, {
		refetchQueries: [{ query: GET_LIST_BY_ID, variables: { listId } }],
	});

	const [newFirst, setNewFirst] = useState("");
	const [newLast, setNewLast] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [editFirst, setEditFirst] = useState("");
	const [editLast, setEditLast] = useState("");

	const handleAddRecipient = async (e) => {
		e.preventDefault();
		if (!newFirst.trim()) return;
		try {
			await createRecipient({
				variables: { firstName: newFirst.trim(), lastName: newLast.trim(), listId },
			});
			setNewFirst("");
			setNewLast("");
		} catch (err) {
			console.error("Error creating recipient:", err);
		}
	};

	const handleUpdate = async (recId) => {
		try {
			await updateRecipient({
				variables: { recId, firstName: editFirst.trim(), lastName: editLast.trim() },
			});
			setEditingId(null);
		} catch (err) {
			console.error("Error updating recipient:", err);
		}
	};

	const handleDelete = async (recId) => {
		try {
			await deleteRecipient({ variables: { recId, listId } });
		} catch (err) {
			console.error("Error deleting recipient:", err);
		}
	};

	const calcRecTotal = (products) =>
		(products || []).reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0).toFixed(2);

	if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
	if (error) return <Typography color="error" sx={{ m: 2 }}>Error: {error.message}</Typography>;

	const list = data?.getListById;
	if (!list) return <Typography sx={{ m: 2 }}>List not found.</Typography>;

	const listTotal = (list.recipients || [])
		.reduce((sum, r) => sum + parseFloat(calcRecTotal(r.products)), 0)
		.toFixed(2);

	return (
		<div className="lists-container">
			<Button
				startIcon={<ArrowBackIcon />}
				onClick={() => navigate("/lists")}
				sx={{ color: "white", mb: 2 }}
			>
				Back to Lists
			</Button>

			<Typography variant="h4" className="lists-title">
				{list.listName}
			</Typography>
			<Typography variant="subtitle1" sx={{ color: "rgba(255,255,255,0.8)", textAlign: "center", mb: 2 }}>
				List Total: ${listTotal}
			</Typography>

			<form onSubmit={handleAddRecipient} className="create-list-form">
				<TextField
					label="First name"
					size="small"
					value={newFirst}
					onChange={(e) => setNewFirst(e.target.value)}
					required
					sx={{ flex: 1, bgcolor: "rgba(255,255,255,0.9)", borderRadius: 1 }}
				/>
				<TextField
					label="Last name"
					size="small"
					value={newLast}
					onChange={(e) => setNewLast(e.target.value)}
					sx={{ flex: 1, bgcolor: "rgba(255,255,255,0.9)", borderRadius: 1 }}
				/>
				<Button
					type="submit"
					variant="contained"
					startIcon={<PersonAddIcon />}
					disabled={!newFirst.trim()}
					sx={{ bgcolor: "var(--custom-green)", "&:hover": { bgcolor: "#145a1e" } }}
				>
					Add
				</Button>
			</form>

			{(!list.recipients || list.recipients.length === 0) ? (
				<Typography sx={{ color: "white", textAlign: "center", mt: 4 }}>
					No recipients on this list yet. Add one above!
				</Typography>
			) : (
				<div className="lists-grid">
					{list.recipients.map((rec) => (
						<div key={rec._id} className="list-card">
							{editingId === rec._id ? (
								<div className="list-edit-row">
									<TextField
										size="small"
										value={editFirst}
										onChange={(e) => setEditFirst(e.target.value)}
										autoFocus
										placeholder="First name"
										sx={{ flex: 1 }}
									/>
									<TextField
										size="small"
										value={editLast}
										onChange={(e) => setEditLast(e.target.value)}
										placeholder="Last name"
										sx={{ flex: 1 }}
									/>
									<IconButton onClick={() => handleUpdate(rec._id)} color="success">
										<CheckIcon />
									</IconButton>
									<IconButton onClick={() => setEditingId(null)} color="error">
										<CloseIcon />
									</IconButton>
								</div>
							) : (
								<>
									<Typography variant="h6" sx={{ fontWeight: "bold" }}>
										{rec.firstName} {rec.lastName}
									</Typography>
									<Typography variant="body2" sx={{ color: "#555", mb: 1 }}>
										{rec.products?.length || 0} gift{rec.products?.length !== 1 ? "s" : ""}
										{" | "}
										Subtotal: ${calcRecTotal(rec.products)}
									</Typography>
									<div className="list-card-actions">
										<Button
											size="small"
											variant="outlined"
											onClick={() => navigate(`/recipients/${rec._id}`)}
										>
											View Gifts
										</Button>
										<IconButton
											size="small"
											onClick={() => {
												setEditingId(rec._id);
												setEditFirst(rec.firstName || "");
												setEditLast(rec.lastName || "");
											}}
										>
											<EditIcon fontSize="small" />
										</IconButton>
										<IconButton
											size="small"
											color="error"
											onClick={() => handleDelete(rec._id)}
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
		</div>
	);
};

export default ListDetail;
