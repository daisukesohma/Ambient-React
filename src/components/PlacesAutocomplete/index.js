import React, { useEffect, useState } from 'react'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import parse from 'autosuggest-highlight/parse'
import PropTypes from 'prop-types'

const PlacesAutocomplete = ({ title, address, onChange }) => {
  const {
    setValue,
    suggestions: { data },
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  })

  const [selectedAddress, setSelectedAddress] = useState(null)
  const [inputValue, setInputValue] = useState(null)

  useEffect(() => {
    setSelectedAddress(address)
    setInputValue(address)
  }, [address, setValue])

  useEffect(() => {
    // Get latitude and longitude via utility functions
    if (selectedAddress) {
      getGeocode({ address: selectedAddress })
        .then(results => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          if (onChange) {
            onChange({ lat, lng, address: selectedAddress })
          }
        })
        .catch(error => {
          console.error('Error fetching coordinates: ', error)
        })
    } else {
      onChange({
        lat: null,
        lng: null,
        address: null,
      })
    }
  }, [selectedAddress, onChange])

  return (
    <Autocomplete
      fullWidth
      getOptionLabel={option =>
        typeof option === 'string' ? option : option.description
      }
      filterOptions={x => x}
      options={data}
      getOptionSelected={option =>
        selectedAddress && option.description === selectedAddress
      }
      inputValue={inputValue}
      autoComplete
      includeInputInList
      filterSelectedOptions
      onChange={(event, option) => {
        if (option) {
          setSelectedAddress(option.description)
        } else {
          setSelectedAddress(null)
        }
      }}
      onInputChange={(event, newInputValue) => {
        setValue(newInputValue)
        setInputValue(newInputValue)
      }}
      renderInput={params => (
        <TextField {...params} label={title} variant='outlined' fullWidth />
      )}
      renderOption={option => {
        const matches =
          option.structured_formatting.main_text_matched_substrings
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map(match => [match.offset, match.offset + match.length]),
        )

        return (
          <Grid container alignItems='center'>
            <Grid item>
              <LocationOnIcon />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {part.text}
                </span>
              ))}

              <Typography variant='body2' color='textSecondary'>
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        )
      }}
    />
  )
}

PlacesAutocomplete.propTypes = {
  title: PropTypes.string,
  address: PropTypes.string,
  onChange: PropTypes.func,
}

export default PlacesAutocomplete
