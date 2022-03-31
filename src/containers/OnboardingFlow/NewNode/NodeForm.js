import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import { CircularProgress } from 'ambient_ui'
import * as yup from 'yup'
import { useMutation } from '@apollo/react-hooks'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
// eslint-disable-next-line import/no-extraneous-dependencies
import { ThemeProvider } from '@material-ui/core/styles'
import get from 'lodash/get'
// src
import IP_VALIDATOR from 'common/validators/ip'
import useSitesByAccount from 'common/hooks/useSitesByAccount'
import { getAccountSlug } from 'utils'

import { THEME, useStyles } from '../common/styles'
import Snackbar from '../common/MuiSnackbar'

import { CREATE_NODE } from './gql'

const nodeSchema = yup.object().shape({
  name: yup.string().required('Name of appliance is Required.'),
  serialNumber: yup
    .string()
    .required('Serial number of appliance is Required.'),
  staticIp: yup
    .string()
    .matches(IP_VALIDATOR, {
      excludeEmptyString: true,
      message: 'Enter a valid IP, IP Range, or Subnet',
    })
    .required('IP address is Required.'),
  subnet: yup
    .string()
    .matches(IP_VALIDATOR, {
      excludeEmptyString: true,
      message: 'Enter a valid IP, IP Range, or Subnet',
    })
    .required('Valid Subnet is Required.'),
  gateway: yup
    .string()
    .matches(IP_VALIDATOR, {
      excludeEmptyString: true,
      message: 'Enter a valid IP, IP Range, or Subnet',
    })
    .required('Valid Gateway is Required.'),
  dnsServers: yup.string(),
  ntpServer: yup.string(),
})

function NodeForm({
  accountSlug,
  history,
  match: {
    params: { site: siteSlug },
  },
}) {
  const classes = useStyles()
  const [addNode, { data, error }] = useMutation(CREATE_NODE)
  const [isToastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [siteId, setSiteId] = useState(undefined)
  const [isSending, setIsSending] = useState(false)
  const accountSiteData = useSitesByAccount(accountSlug)

  // Transform SiteSlug and AccountSlug into SiteId
  // 1. UseSitesByAccount hook, 2. awaits result, 3. finds matching siteslug, 4. sets siteId
  // We conditionally show Next button on whether siteId exists (ie. it's a condition of submission)
  //
  useEffect(() => {
    if (accountSiteData.data) {
      const site = accountSiteData.data.find(
        account => account.slug === siteSlug,
      )

      if (get(site, 'id')) {
        setSiteId(site.id)
      }
    }
    // eslint-disable-next-line
  }, [accountSiteData])

  function successRedirect(nodeId) {
    history.push(
      `/accounts/${accountSlug}/infrastructure/sites/${siteSlug}/appliances/${nodeId}/cameras/config`,
    )
  }

  useEffect(() => {
    setIsSending(false)
    if (get(data, 'createNode.ok') && get(data, 'createNode.nodeId')) {
      successRedirect(data.createNode.nodeId)
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
          `Ambient.ai Appliance Serial Number may already be registered. Please double check info.`,
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
        validationSchema={nodeSchema}
        initialValues={{
          name: '',
          serialNumber: '',
          staticIp: '',
          subnet: '',
          gateway: '',
        }}
        onSubmit={(values, actions) => {
          setIsSending(true)
          const { name, serialNumber, staticIp, subnet, gateway } = values

          const input = {
            name,
            siteId,
            serialNumber,
            staticIp,
            subnet,
            gateway,
          }
          addNode({
            variables: {
              nodeData: input,
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
        }) => {
          return (
            <form className={classes.container} onSubmit={handleSubmit}>
              <TextField
                required
                label='Name'
                name='name'
                className={classes.textField}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name && touched.name}
                helperText={errors.name && touched.name && errors.name}
                margin='normal'
                variant='outlined'
              />
              <TextField
                required
                label='Serial Number'
                name='serialNumber'
                className={classes.textField}
                value={values.serialNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.serialNumber && touched.serialNumber}
                helperText={
                  errors.serialNumber &&
                  touched.serialNumber &&
                  errors.serialNumber
                }
                margin='normal'
                variant='outlined'
              />
              <TextField
                required
                label='Static Ip'
                name='staticIp'
                className={classes.textField}
                value={values.staticIp}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.staticIp && touched.staticIp}
                helperText={
                  errors.staticIp && touched.staticIp && errors.staticIp
                }
                margin='normal'
                variant='outlined'
              />
              <TextField
                required
                label='Subnet'
                name='subnet'
                className={classes.textField}
                value={values.subnet}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.subnet && touched.subnet}
                helperText={errors.subnet && touched.subnet && errors.subnet}
                margin='normal'
                variant='outlined'
              />
              <TextField
                required
                label='Gateway'
                name='gateway'
                className={classes.textField}
                value={values.gateway}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.gateway && touched.gateway}
                helperText={errors.gateway && touched.gateway && errors.gateway}
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
                    disabled={!siteId || isSending}
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

NodeForm.propTypes = {
  accountSlug: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }),
}

NodeForm.defaultTypes = {
  accountSlug: '',
  history: {
    push: () => {},
  },
  match: {
    params: {
      site: '',
    },
  },
}

const mapStateToProps = state => ({
  accountSlug: getAccountSlug(state),
})

const mapDispatchToProps = dispatch => ({
  dispatch,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(NodeForm))
