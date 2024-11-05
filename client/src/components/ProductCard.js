import Card from 'react-bootstrap/Card';
import {useState, useEffect} from 'react';


export default function ProductCard({prodData}) {

  return (
    <>
<div className="prod-card-container">
<Card bg="dark" text='white' key={prodData.itemId} style={{ width: '300px', height: '400px' }}>
  <Card.Img
    variant="top"
    src={prodData.mainImage}
    style={{ height: '180px', objectFit: 'cover' }}
  />
  <Card.Body >
    <Card.Title>{prodData.itemName}</Card.Title>
    <Card.Text >
      Ebay Price: ${prodData.price}
    </Card.Text>
</Card.Body>
</Card>
<div className="prod-card-stylings">
<a href={prodData.buyUrl} target="_blank" rel="noopener noreferrer">
<button>Buy Now On Ebay!</button>
</a>
<button>Add To List</button>
</div>
</div>
</>
  )
}
