import React, { useState, useEffect } from "react";
import Auth from "../utils/auth";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_EBAY_PRODUCTS } from "../utils/queries";

// Material UI
import Grid from "@mui/material/Grid";
import Item from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
// Icons
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const SearchResults = () => {
  // hold search data
  const [searchedItems, setSearchedItems] = useState([]);
  // hold search field data
  const [searchInput, setSearchInput] = useState("");
  // hold clicked state
  const [clicked, setClicked] = useState(false);

  const [getProducts, { data, loading, error }] = useLazyQuery(GET_EBAY_PRODUCTS);

  // Update searched items when data changes
  useEffect(() => {
    if (data && data.getEbayProducts) {
      console.log('look at this damn data: ' , data);
      setSearchedItems(data.getEbayProducts);
    }
  }, [data]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setClicked(true);

    if (searchInput.trim() === "") return;

    getProducts({ variables: { product: searchInput } });
  };

  return (
    <>
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
            variant="outlined"
            label="Search"
            margin="normal"
            fullWidth
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSearchedItems([]);
              setClicked(false);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            endIcon={<ShoppingCartIcon />}
            disabled={!searchInput}
          >
            Shop
          </Button>
        </form>
      ) : null}
      {Auth.loggedIn() ? (
        <Paper color="primary" elevation={3}>
          <Typography
            sx={{ padding: "1rem" }}
            align="center"
            variant="h3"
            gutterBottom
            component="div"
          >
            {loading
              ? "Loading..."
              : clicked && searchedItems.length <= 0
              ? "No results found."
              : "Search for an item to begin"}
          </Typography>
        </Paper>
      ) : null}

      {error && <Typography color="error">Hmmm... No results</Typography>}

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {searchedItems.map((item, index) => (
          <Grid item key={index} xs={2} sm={4} md={4}>
            <Item>{item.itemName}</Item>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default SearchResults;
