import React, { useState, useEffect } from "react";
import Auth from "../utils/auth";
import { useLazyQuery } from "@apollo/client";
import { GET_EBAY_PRODUCTS } from "../utils/queries";
import { CircularProgress } from '@mui/material';
import ProductCard from "./ProductCard";
import AddToListModal from "./AddToListModal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const SearchResults = () => {
  // hold search data
  const [searchedItems, setSearchedItems] = useState([]);
  // hold search field data
  const [searchInput, setSearchInput] = useState("");

  const [getProducts, { data, loading, error }] = useLazyQuery(GET_EBAY_PRODUCTS);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Update searched items when data changes
  useEffect(() => {
    if (data && data.getEbayProducts) {
      setSearchedItems(data.getEbayProducts);
    }
  }, [data]);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (searchInput.trim() === "") return;

    getProducts({ variables: { product: searchInput } });
  };

  const handleChooseList = () => {
    setIsModalOpen(false); // Close the modal after creating a list
  };

  const openModal = (product, shouldOpen) => {
    setCurrentProduct(product);
    setIsModalOpen(shouldOpen);
  };

  return (
    <>
          {/* AddToList Modal */}
          <AddToListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onListChosen={handleChooseList}
        productToAdd={currentProduct}
      />
      <div className='search-container'>
        {!Auth.loggedIn() ? (
          <Paper color="primary" elevation={3}>
            <Typography
              sx={{ padding: "1rem" }}
              align="center"
              variant="h3"
              gutterBottom
              component="div"
            >
              Log In or Sign Up to Begin!!!
            </Typography>
          </Paper>
        ) : null}
        
        {Auth.loggedIn() ? (
          <form
            onSubmit={handleFormSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "8px",
            }}
          >
            <TextField
              label="Search"
              margin="normal"
              className="search-bar"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setSearchedItems([]);
              }}
            />

            <Button
              className={searchInput? "search-button": "empty-search-button"}
              type="submit"
              variant="outlined"
              size="large"
              endIcon={<EmojiEmotionsIcon />}
              disabled={!searchInput}
            >
              {searchInput ? "Click To Search Ebay!" : "Type Something to get Started!"}
              {loading ? <CircularProgress color="inherit" /> : ""}
            </Button>
          </form>
        ) : null}

        {error && <Typography color="error">Hmmm... No results</Typography>}
        <div className="card-div">
          {searchedItems.map((item, index) => (
            <ProductCard 
              key={index} 
              prodData={item} 
              openModal={openModal} // Pass the openModal function
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
