import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Card, CardContent, Typography } from "@mui/material";

function FilterMenu({ city, setCity, category, setCategory }) {
  const categories = [
    "Social",
    "Entertainment",
    "Sports",
    "Food",
    "Outdoor",
    "Gaming",
    "Carpool",
  ];

  const cities = ["Waterloo", "Kitchener", "Tonronto"];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
      <Card sx={{ width: "90%", maxWidth: "1200px", boxShadow: 3 }}>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="city-select-label">City</InputLabel>
              <Select
                labelId="city-select-label"
                value={city}
                label="City"
                onChange={(e) => setCity(e.target.value)}
              >
                {cities.map((cty) => (
                  <MenuItem key={cty} value={cty}>
                    {cty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default FilterMenu;
