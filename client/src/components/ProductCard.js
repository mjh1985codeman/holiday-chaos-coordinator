import Card from 'react-bootstrap/Card';


export default function ProductCard({prodData}) {
  return (
    <>
<Card bg="dark" text='white' key={prodData.itemId} style={{ width: '300px', height: '400px' }}>
  <Card.Img
    variant="top"
    src={prodData.mainImage}
    style={{ height: '180px', objectFit: 'cover' }}
  />
  <Card.Body>
    <Card.Title>{prodData.itemName}</Card.Title>
    <Card.Text >
      {prodData.price}
    </Card.Text>
  </Card.Body>
</Card>
    </>
  )
}
