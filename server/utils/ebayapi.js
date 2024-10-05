const ebayApiKey = process.env.EBAY_KEY;
const fetch = require('node-fetch');

module.exports = {
  getProducts: async (product) => {
//I WILL UPDATE THIS ONCE I FIND AN API THAT WORKS.
    // const url = `urlhere/${product}`;
    // const options = {
    //   method: 'GET',
    //   headers: {
    //     //keythings
    //   }
    // };
    
    // try {
    //     const response = await fetch(url, options);
    //     const result = await response.text();
    //     return result;
    // } catch (error) {
    //     console.error(error);
    //     return `There was an error searching for the product: ${error}`;
    // }

    return `Hurray you hit the end point and are getting a response.  Product: ${product}`
  }
};
