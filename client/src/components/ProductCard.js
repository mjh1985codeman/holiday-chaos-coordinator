import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function ProductCard({ prodData, openModal, giftRouteAction }) {
	return (
		<div className="prod-card-container">
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
					image={prodData.mainImage}
					alt={prodData.itemName}
					sx={{ height: 180, objectFit: "cover" }}
				/>
				<CardContent>
					<Typography variant="subtitle1" component="div" noWrap>
						{prodData.itemName}
					</Typography>
					<Typography variant="body2">
						Ebay Price: ${prodData.price}
					</Typography>
				</CardContent>
			</Card>
			<div className="prod-card-stylings">
				<a href={prodData.buyUrl} target="_blank" rel="noopener noreferrer">
					<button className="prod-button">Buy Now On Ebay!</button>
				</a>
				<button
					className="prod-button"
					onClick={() => {
						openModal(prodData, true);
						giftRouteAction("list");
					}}
				>
					Add To List
				</button>
				<button
					className="prod-button"
					onClick={() => {
						openModal(prodData, true);
						giftRouteAction("recipient");
					}}
				>
					Add To Recipient
				</button>
			</div>
		</div>
	);
}
