import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import * as yup from 'yup'
import { CircularProgress } from 'ambient_ui'
import { useMutation } from '@apollo/react-hooks'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button' // import { Button } from 'ambient_ui';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ThemeProvider } from '@material-ui/core/styles'
import slugify from 'slugify'
import get from 'lodash/get'

import { addSite as addSiteAction } from '../../../redux/slices/auth'
import { getAccountSlug } from '../../../utils'
import { THEME, useStyles } from '../common/styles'
import Snackbar from '../common/MuiSnackbar'

import { ALL_SITES_BY_ACCOUNT, CREATE_SITE } from './gql'

// import { DropdownMenu } from 'ambient_ui'

// const COUNTRIES = [
//   'United States of America - USA'
// ]

const siteSchema = yup.object().shape({
  name: yup.string().required('The name of your site is required.'),
  slug: yup
    .string()
    .required('Site url is required. Default is based on name above.'),
  address: yup.string().required('Address is required.'),
  city: yup.string().required('City is required.'),
  state: yup.string().required('State is Required.'),
  country: yup.string().required('Country is required.'),
  zip: yup.string().required('Zip is required.'),
})

function setAddress(address, city, state, country, zip) {
  return `${address}, ${city}, ${state}, ${country}, ${zip}`
}

function SiteForm({ accountSlug, history, addSiteRedux }) {
  const classes = useStyles()
  const [isToastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [addSite, { data, error }] = useMutation(CREATE_SITE, {
    refetchQueries: [
      {
        query: ALL_SITES_BY_ACCOUNT, // refresh this for NodeForm page
        variables: { accountSlug },
      },
    ],
  })

  function successRedirect(siteSlug) {
    setIsSending(false)
    history.push(
      `/accounts/${accountSlug}/infrastructure/sites/${siteSlug}/appliances/new`,
    )
  }

  useEffect(() => {
    if (get(data, 'createSite.ok') && get(data, 'createSite.siteSlug')) {
      addSiteRedux({
        slug: get(data, 'createSite.siteSlug'),
        id: get(data, 'createSite.siteId'),
        name: get(data, 'createSite.siteName'),
        accountSlug,
      })
      successRedirect(data.createSite.siteSlug)
    }
    // eslint-disable-next-line
  }, [data])

  useEffect(() => {
    if (get(error, 'graphQLErrors')) {
      const errorMessage = get(error, 'graphQLErrors[0].message')
      if (errorMessage && errorMessage.includes('Duplicate entry')) {
        // primary key graphql error
        setToastVisible(true)
        setToastMessage(
          `Site Url already exists. Please use a unique site url for your account.`,
        )
      } else {
        setToastVisible(true)
        setToastMessage(`Database error: ${errorMessage}`)
      }
    }
  }, [error])

  return (
    <>
      <Snackbar
        open={isToastVisible}
        handleClose={() => setToastVisible(false)}
        message={toastMessage}
      />
      <Formik
        enableReinitialize
        validationSchema={siteSchema}
        initialValues={{
          name: '',
          slug: '',
          address: '',
          city: '',
          state: '',
          country: 'USA',
          zip: '',
        }}
        onSubmit={(values, actions) => {
          setIsSending(true)
          const { name, slug, address, city, country, state, zip } = values
          const fullAddress = setAddress(address, city, state, country, zip)
          const input = {
            name,
            accountSlug,
            address: fullAddress,
            slug,
            siteTypeId: 1, // corporate
          }
          addSite({
            variables: {
              siteData: input,
            },
          })
          actions.setSubmitting(false)
        }}
        render={({
          values,
          errors,
          status,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => {
          return (
            <form className={classes.container} onSubmit={handleSubmit}>
              <TextField
                required
                label='Name'
                name='name'
                className={classes.textField}
                value={values.name}
                onChange={e => {
                  setFieldValue('name', e.target.value)
                  setFieldValue(
                    'slug',
                    slugify(e.target.value, {
                      lower: true,
                    }),
                  )
                }}
                onBlur={handleBlur}
                error={errors.name && touched.name}
                helperText={errors.name && touched.name && errors.name}
                margin='normal'
                variant='outlined'
              />
              <TextField
                required
                label='Site Url'
                name='slug'
                className={classes.textField}
                value={values.slug}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.slug && touched.slug}
                helperText={errors.slug && touched.slug && errors.slug}
                margin='normal'
                variant='outlined'
              />
              <TextField
                required
                label='Address'
                name='address'
                className={classes.textField}
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.address && touched.address}
                helperText={errors.address && touched.address && errors.address}
                margin='normal'
                variant='outlined'
              />
              <TextField
                required
                label='City'
                name='city'
                className={classes.textField}
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.city && touched.city}
                helperText={errors.city && touched.city && errors.city}
                margin='normal'
                variant='outlined'
              />
              <TextField
                required
                label='State'
                name='state'
                className={classes.textField}
                value={values.state}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.state && touched.state}
                helperText={errors.state && touched.state && errors.state}
                margin='normal'
                variant='outlined'
              />
              <TextField
                required
                label='Zip Code'
                name='zip'
                className={classes.textField}
                value={values.zip}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.zip && touched.zip}
                helperText={errors.zip && touched.zip && errors.zip}
                margin='normal'
                variant='outlined'
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ThemeProvider theme={THEME}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    className={classes.button}
                    disabled={isSending}
                  >
                    {isSending ? <CircularProgress /> : 'Next'}
                  </Button>
                </ThemeProvider>
              </div>
            </form>
          )
        }}
      />
    </>
  )
}

SiteForm.propTypes = {
  accountSlug: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  addSiteRedux: PropTypes.func,
}

SiteForm.defaultTypes = {
  accountSlug: undefined,
  history: {
    push: () => {},
  },
  addSiteRedux: () => {},
}

const mapStateToProps = state => ({
  accountSlug: getAccountSlug(state),
})

const mapDispatchToProps = dispatch => ({
  addSiteRedux: ({ id, slug, name, accountSlug }) =>
    dispatch(addSiteAction({ id, slug, name, accountSlug })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(SiteForm))
