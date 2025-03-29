import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Stack
} from "@mui/material";

const categories = [
  "Social",
  "Entertainment",
  "Sports",
  "Food",
  "Outdoor",
  "Gaming",
  "Carpool"
];

function FilterMenu({ city, setCity, category, setCategory }) {
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 1
      }}
    >
      <Stack direction="row" alignItems="center" spacing={3}>
        <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
          Filter Events
        </Typography>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>City</InputLabel>
          <Select value={city} label="City" onChange={handleCityChange}>
            <MenuItem value="Waterloo">Waterloo</MenuItem>
            <MenuItem value="Toronto">Toronto</MenuItem>
            <MenuItem value="Kitchener">Kitchener</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={handleCategoryChange}>
            <MenuItem value="">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat.toLowerCase()}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}

export default FilterMenu;
