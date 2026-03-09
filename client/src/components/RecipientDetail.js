import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_RECIPIENT_BY_ID } from "../utils/queries";
import { REMOVE_ITEM_FROM_REC } from "../utils/mutations";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const RecipientDetail = () => {
	const { recId } = useParams();
	const navigate = useNavigate();
	const { data, loading, error } = useQuery(GET_RECIPIENT_BY_ID, {
		variables: { recId },
	});
	const [removeItem] = useMutation(REMOVE_ITEM_FROM_REC, {
		refetchQueries: [{ query: GET_RECIPIENT_BY_ID, variables: { recId } }],
	});

	const handleRemove = async (itemId) => {
		try {
			await removeItem({ variables: { recId, itemId } });
		} catch (err) {
			console.error("Error removing item:", err);
		}
	};

	if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
	if (error) return <Typography color="error" sx={{ m: 2 }}>Error: {error.message}</Typography>;

	const recipient = data?.getRecipientById;
	if (!recipient) return <Typography sx={{ m: 2 }}>Recipient not found.</Typography>;

	const total = (recipient.products || [])
		.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0)
		.toFixed(2);

	return (
		<div className="lists-container">
			<Button
				startIcon={<ArrowBackIcon />}
				onClick={() => navigate(-1)}
				sx={{ color: "white", mb: 2 }}
			>
				Back
			</Button>

			<Typography variant="h4" className="lists-title">
				{recipient.firstName} {recipient.lastName}
			</Typography>
			<Typography variant="subtitle1" sx={{ color: "rgba(255,255,255,0.8)", textAlign: "center", mb: 2 }}>
				{recipient.products?.length || 0} gift{recipient.products?.length !== 1 ? "s" : ""}
				{" | "}Spending: ${total}
			</Typography>

			{(!recipient.products || recipient.products.length === 0) ? (
				<Typography sx={{ color: "white", textAlign: "center", mt: 4 }}>
					No gifts assigned yet. Search for products and add them!
				</Typography>
			) : (
				<div className="card-div">
					{recipient.products.map((product, idx) => (
						<div key={`${product.itemId}-${idx}`} className="prod-card-container">
							<Card
								sx={{
									width: 300,
									height: 400,
									bgcolor: "#343a40",
									color: "white",
								}}
							>
								<CardMedia
									component="img"
									image={product.mainImage}
									alt={product.itemName}
									sx={{ height: 180, objectFit: "cover" }}
								/>
								<CardContent>
									<Typography variant="subtitle1" component="div" noWrap>
										{product.itemName}
									</Typography>
									<Typography variant="body2">
										${product.price}
									</Typography>
									{product.itemCondition && (
										<Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
											Condition: {product.itemCondition}
										</Typography>
									)}
								</CardContent>
								<CardActions sx={{ justifyContent: "space-between", px: 2 }}>
									<Button
										size="small"
										href={product.buyUrl}
										target="_blank"
										rel="noopener noreferrer"
										sx={{ color: "#81c784" }}
									>
										Buy on eBay
									</Button>
									<IconButton
										size="small"
										onClick={() => handleRemove(product.itemId)}
										sx={{ color: "#ef5350" }}
									>
										<DeleteIcon />
									</IconButton>
								</CardActions>
							</Card>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default RecipientDetail;
