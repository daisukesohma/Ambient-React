import React from 'react'
import TextField from '@material-ui/core/TextField'
import { Button } from 'ambient_ui'

const AddUserForm = () => {
  return (
    <div>
      <div>
        <TextField
          required
          id='outlined-basic'
          helperText='*Required'
          label='First Name'
          variant='outlined'
        />
      </div>
      <div>
        <TextField
          required
          id='outlined-basic'
          helperText='*Required'
          label='Last Name'
          variant='outlined'
        />
      </div>
      <div>
        <TextField
          required
          id='outlined-basic'
          helperText='*Required. We send an email invite to this address'
          label='Last Name'
          variant='outlined'
        />
      </div>
      <div>
        <Button variant='contained' color='primary'>
          Cancel
        </Button>
        <Button variant='contained' color='primary'>
          Add
        </Button>
      </div>
    </div>
  )
}

export default AddUserForm
