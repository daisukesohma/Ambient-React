import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, Grid, Input } from '@material-ui/core'
// import { Typography, Grid, Input } from '@material-ui/core'
import { Button, SearchableSelectDropdown } from 'ambient_ui'
// src

import {
  updateContactRequested,
  closeUpdateModal,
} from '../../contactResourcesSlice'

import useStyles from './styles'

const UpdateContactModal = () => {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const modalOpened = useSelector(
    state => state.contactResources.updateModalOpened,
  )
  const classes = useStyles({ darkMode })

  const isLoading = useSelector(
    state => state.contactResources.updateContactLoading,
  )
  const sites = useSelector(state => state.auth.sites)
  const contactToUpdate = useSelector(
    state => state.contactResources.contactToUpdate,
  )
  const [contactResourceType, setContactResourceType] = useState(null)
  const [name, setName] = useState(null)
  const [typeData, setTypeData] = useState(null)
  const [menuTarget, setMenuTarget] = useState(
    document.querySelectorAll('[role="presentation"]')[0],
  )

  const [siteOptions, setSiteOptions] = useState([])
  const [siteSlug, setSiteSlug] = useState(null)

  useEffect(() => {
    setName(contactToUpdate.name)
    if (contactToUpdate.type === 'Phone') setContactResourceType('PHONE')
    if (contactToUpdate.type === 'Email') setContactResourceType('EMAIL')
    setTypeData(contactToUpdate.details)
    if (contactToUpdate.site) setSiteSlug(contactToUpdate.site.slug)
  }, [
    contactToUpdate,
    setContactResourceType,
    setName,
    setTypeData,
    setSiteSlug,
  ])

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
    dispatch(closeUpdateModal())
  }

  const onClickCancel = () => {
    handleClose()
  }

  const handleUpdateContact = useCallback(
    input => {
      dispatch(updateContactRequested({ input }))
    },
    [dispatch],
  )

  // updating to a null site requires sending the string 'NULL'
  const onYesClick = () => {
    const input = {
      id: contactToUpdate.id,
      name,
      contactResourceType,
      typeData,
      siteSlug: siteSlug === null ? 'NULL' : siteSlug,
    }
    handleUpdateContact(input)
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant='h4'>
        Update Contact
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
              value={name}
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
              value={typeOptions.filter(
                ({ value }) => value === contactResourceType,
              )}
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
                underline: 'white',
              }}
              onChange={handleTypeDataChange}
              value={typeData}
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
  <UpdateContactModal {...props} ref={ref} />
))
