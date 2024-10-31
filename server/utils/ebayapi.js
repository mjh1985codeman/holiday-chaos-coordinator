const ebayClientId = process.env.EBAY_CLIENT_ID;
const ebaySecret = process.env.EBAY_CLIENT_SECRET;
const fetch = require('node-fetch');

const getEbayToken = async () => {
  const base64AuthString = Buffer.from(`${ebayClientId}:${ebaySecret}`).toString('base64');
  console.log('auth string? ', base64AuthString);

  const formData = new URLSearchParams();
  formData.append('grant_type', 'client_credentials');
  formData.append('scope', 'https://api.ebay.com/oauth/api_scope'); // Add the required scope for Browse API

  const ebToken = await fetch(`https://api.ebay.com/identity/v1/oauth2/token`, 
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64AuthString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString() // URL-encoded form data
    });

  return ebToken.json();
}

module.exports = {

  getProducts: async ({product}) => {
    const ebToken = await getEbayToken();
    if(!ebToken) {
      console.error("Error Getting the Ebay token.");
      return "Unable to get EbayToken";
    };


    const response = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${product}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ebToken.access_token}`, // Use the token you got from the OAuth call
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error fetching items: ${error.errors[0].message}`);
    }
  
    const data = await response.json();
    return data;
  },

  getProductByItemId: async (itemId) => {
    const ebToken = await getEbayToken();
    if(!ebToken) {
      console.error("Error Getting the Ebay token.");
      return "Unable to get EbayToken";
    };


    const response = await fetch(`https://api.ebay.com/buy/browse/v1/item/${itemId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ebToken.access_token}`, // Use the token you got from the OAuth call
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error fetching item by Id: ${error.errors[0].message}`);
    }
  
    const data = await response.json();
    return data;
  },

  };
