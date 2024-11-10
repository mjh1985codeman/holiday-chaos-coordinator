
import { Card } from 'react-bootstrap';

export default function ProductCard({ prodData, openModal, giftRouteAction}) {


    return (
        <div className="prod-card-container">
            <Card bg="dark" text='white' key={prodData.itemId} style={{ width: '300px', height: '400px' }}>
                <Card.Img variant="top" src={prodData.mainImage} style={{ height: '180px', objectFit: 'cover' }} />
                <Card.Body>
                    <Card.Title>{prodData.itemName}</Card.Title>
                    <Card.Text>
                        Ebay Price: ${prodData.price}
                    </Card.Text>
                </Card.Body>
            </Card>
            <div className="prod-card-stylings">
                <a href={prodData.buyUrl} target="_blank" rel="noopener noreferrer">
                    <button className='prod-button'>Buy Now On Ebay!</button>
                </a>
                {/* Use the passed function to open the modal */}
                <button className='prod-button' onClick={() => {openModal(prodData, true); giftRouteAction("list")}}>Add To List</button>
                <button className='prod-button' onClick={() => {openModal(prodData, true); giftRouteAction("recipient")}}>Add To Recipient</button>
            </div>
        </div>
    );
}
