import React, { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, Grid, Input } from '@material-ui/core'
// import { Typography, Grid, Input } from '@material-ui/core'
import { Button, SearchableSelectDropdown } from 'ambient_ui'
// src

import {
  createContactRequested,
  closeCreateModal,
} from '../../contactResourcesSlice'

import useStyles from './styles'

const CreateContactModal = () => {
  const { account } = useParams()
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const modalOpened = useSelector(
    state => state.contactResources.createModalOpened,
  )
  const classes = useStyles({ darkMode })

  const isLoading = useSelector(
    state => state.contactResources.createContactLoading,
  )
  const sites = useSelector(state => state.auth.sites)
  const [contactResourceType, setContactResourceType] = useState(null)
  const [name, setName] = useState(null)
  const [typeData, setTypeData] = useState(null)
  const [menuTarget, setMenuTarget] = useState(
    document.querySelectorAll('[role="presentation"]')[0],
  )

  const [siteOptions, setSiteOptions] = useState([
    {
      value: null,
      label: 'Select Site',
    },
  ])
  const [siteSlug, setSiteSlug] = useState(null)

  useEffect(() => {
    setMenuTarget(document.querySelectorAll('[role="presentation"]')[0])
  }, [modalOpened, setMenuTarget])

  useEffect(() => {
    const options = sites.map(site => ({
      value: site.slug,
      label: site.name,
    }))
    const formattedSites = [
      {
        value: null,
        label: 'Select Site',
      },
      ...options,
    ]
    setSiteOptions(formattedSites)
  }, [sites, setSiteOptions])

  const typeOptions = [
    {
      value: 'PHONE',
      label: 'Phone',
    },
    {
      value: 'EMAIL',
      label: 'Email',
    },
  ]

  const handleTypeSelect = option => {
    setContactResourceType(option.value)
  }

  const handleNameChange = e => {
    setName(e.target.value)
  }

  const handleTypeDataChange = e => {
    setTypeData(e.target.value)
  }

  const handleSiteSelect = option => {
    setSiteSlug(option.value)
  }

  const handleClose = () => {
    dispatch(closeCreateModal())
  }

  const onClickCancel = () => {
    handleClose()
  }

  const handleCreateContact = useCallback(
    input => {
      dispatch(createContactRequested({ input }))
    },
    [dispatch],
  )

  const onYesClick = () => {
    const input = {
      accountSlug: account,
      name,
      contactResourceType,
      typeData,
      siteSlug,
    }
    handleCreateContact(input)
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant='h4'>
        Create Contact
      </Typography>
      <Grid container>
        <Grid className={classes.inputRow}>
          <Typography className={classes.label}>Name:</Typography>
          <div className={classes.fields}>
            <Input
              classes={{
                root: classes.input,
                inputProps: classes.input,
                InputProps: classes.input,
                underline: 'white',
              }}
              onChange={handleNameChange}
            />
          </div>
        </Grid>
        <Grid className={classes.inputRow}>
          <Typography className={classes.labelDropDown}>Site:</Typography>
          <div className={classes.fields}>
            <SearchableSelectDropdown
              menuPortalTarget={menuTarget}
              options={siteOptions}
              onChange={handleSiteSelect}
              value={siteOptions.filter(({ value }) => value === siteSlug)}
            />
          </div>
        </Grid>
        <Grid className={classes.inputRow}>
          <Typography className={classes.labelDropDown}>Type:</Typography>
          <div className={classes.fields}>
            <SearchableSelectDropdown
              menuPortalTarget={menuTarget}
              options={typeOptions}
              onChange={handleTypeSelect}
            />
          </div>
        </Grid>
        <Grid className={classes.inputRow}>
          <Typography className={classes.label}>
            {contactResourceType === 'EMAIL' ? 'Email:' : 'Phone:'}
          </Typography>
          <div className={classes.fields}>
            <Input
              classes={{
                root: classes.input,
                inputProps: classes.input,
                InputProps: classes.input,
              }}
              onChange={handleTypeDataChange}
            />
          </div>
        </Grid>
      </Grid>
      <Grid className={classes.btnContainer}>
        <Button
          onClick={onClickCancel}
          variant='outlined'
          style={{ marginRight: 8 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onYesClick}
          disabled={
            !name ||
            !contactResourceType ||
            !typeData || typeData.length === 0 ||
            !siteSlug ||
            isLoading
          }
          loading={isLoading}
        >
          Confirm
        </Button>
      </Grid>
    </div>
  )
}

export default React.forwardRef((props, ref) => (
  <CreateContactModal {...props} ref={ref} />
))
