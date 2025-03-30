import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { TextField, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function CityLocationAutocomplete({
  city,
  location,
  setLocation,
  locationError,
  setLocationError,
}) {
  const [inputValue, setInputValue] = useState(location);

  const theme = useTheme();

  const handleSelect = async (selected) => {
    try {
      setInputValue(selected);
      setLocation(selected);
      setLocationError('');
      const results = await geocodeByAddress(selected);
      if (results && results.length > 0) {
        const { lat, lng } = await getLatLng(results[0]);
        console.log('Coordinates from Google Autocomplete:', lat, lng);
      }
    } catch (error) {
      console.error('Error in autocomplete handleSelect:', error);
    }
  };

  return (
    <PlacesAutocomplete
      value={inputValue}
      onChange={(val) => {
        setInputValue(val);
        setLocation(val);
        if (!val) setLocationError('Location cannot be empty');
      }}
      onSelect={handleSelect}
      searchOptions={{
        componentRestrictions: { country: 'ca' },
      }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <Box sx={{ width: '50rem', position: 'relative' }}>
          <TextField
            variant="outlined"
            fullWidth
            error={Boolean(locationError)}
            helperText={locationError}
            {...getInputProps({
              placeholder: `Search location in ${city}...`,
            })}
          />

          {(loading || suggestions.length > 0) && (
            <Box
              sx={{
                position: 'absolute',
                top: '3.6rem',  
                width: '100%',
                border: '1px solid',
                borderColor: theme.palette.divider,
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                zIndex: 9999,
              }}
            >
              {loading && (
                <Typography variant="body2" sx={{ p: 1 }}>
                  Loading suggestions...
                </Typography>
              )}
              {suggestions.map((suggestion) => {
                const style = {
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  backgroundColor: suggestion.active
                    ? theme.palette.action.hover
                    : theme.palette.background.paper,
                };
                return (
                  <Box
                    key={suggestion.placeId}
                    {...getSuggestionItemProps(suggestion, { style })}
                  >
                    {suggestion.description}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      )}
    </PlacesAutocomplete>
  );
}
