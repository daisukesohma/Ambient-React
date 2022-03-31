import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Formik, Form, FieldArray } from 'formik'
import TextField from '@material-ui/core/TextField'
import { Button } from 'ambient_ui'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import { useMutation } from '@apollo/react-hooks'
import get from 'lodash/get'

import { getAccountSlug } from '../../../../utils'
import { useStyles } from '../../common/styles'

import { CREATE_NODE_DISCOVERY_REQUEST } from './gql'

// FieldArray Formik example code adapted:
// https://gist.github.com/rossbulat/229a16fd50a18803e90d624ad1413511
const CameraCredentialsForm = ({
  accountSlug,
  formValues,
  history,
  match: {
    params: { nodeId, site: siteSlug },
  },
}) => {
  const classes = useStyles()
  const [addNodeDiscoveryRequest, { data }] = useMutation(
    CREATE_NODE_DISCOVERY_REQUEST,
  )

  function handleOnSubmit(values, actions) {
    actions.setSubmitting(false) // Formik-specific action
  }

  const defaultCredential = { username: '', password: '' }
  const credentials = [defaultCredential]

  // NOTE: can change to useReducer call
  //
  function addCredentialsToSubmitObj(newCredentials) {
    return {
      ...formValues,
      request: {
        ...formValues.request,
        credentials: newCredentials,
      },
    }
  }

  // stringify (twice) the request key
  function formatSubmitObj(obj) {
    return {
      ...obj,
      request: JSON.stringify(obj.request),
    }
  }

  function successRedirect() {
    history.push(
      `/accounts/${accountSlug}/infrastructure/sites/${siteSlug}/appliances/${nodeId}/cameras/discover`,
    )
  }

  useEffect(() => {
    if (get(data, 'createNodeDiscoveryRequest.ok')) {
      successRedirect(data)
    }
    // eslint-disable-next-line
  }, [data])

  /* eslint-disable react/prop-types */
  return (
    <>
      <Formik
        initialValues={{
          credentials,
        }}
        onSubmit={handleOnSubmit}
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
            <Form>
              <FieldArray
                name='credentials'
                render={arrayHelpers => (
                  <>
                    {values.credentials.map((credential, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <TextField
                          required
                          label='Username'
                          name={`credentials.${index}.username`}
                          className={classes.textField}
                          value={credential.username}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.username && touched.username}
                          helperText={
                            errors.username &&
                            touched.username &&
                            errors.username
                          }
                          margin='normal'
                          variant='outlined'
                        />
                        <TextField
                          required
                          label='Password'
                          type='password'
                          name={`credentials.${index}.password`}
                          className={classes.textField}
                          value={credential.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.password && touched.password}
                          helperText={
                            errors.password &&
                            touched.password &&
                            errors.username
                          }
                          margin='normal'
                          variant='outlined'
                        />
                        {/* Remove this credential */}
                        <div onClick={() => arrayHelpers.remove(index)}>
                          <IconButton size='small'>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </div>
                      </div>
                    ))}

                    {/* Add a new empty credential at the end of the list */}
                    <Button
                      size='small'
                      variant='outlined'
                      onClick={() => arrayHelpers.push(defaultCredential)}
                    >
                      Add Credential
                    </Button>
                    <div
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Button
                        size='small'
                        onClick={() => {
                          const submission = formatSubmitObj(
                            addCredentialsToSubmitObj(values.credentials),
                          )
                          addNodeDiscoveryRequest({
                            variables: {
                              data: submission,
                            },
                          })
                        }}
                      >
                        Complete
                      </Button>
                    </div>
                  </>
                )}
              />
            </Form>
          )
        }}
      />
    </>
  )
  /* eslint-enable react/prop-types */
}

CameraCredentialsForm.propTypes = {
  accountSlug: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      nodeId: PropTypes.string,
      site: PropTypes.string,
    }),
  }),
  history: PropTypes.func,
  formValues: PropTypes.object,
}

CameraCredentialsForm.defaultTypes = {
  accountSlug: '',
  formValues: {},
  match: {
    params: {
      nodeId: '',
      site: '',
    },
  },
  history: () => {},
}

const mapStateToProps = state => ({
  accountSlug: getAccountSlug(state),
})

export default connect(mapStateToProps, null)(withRouter(CameraCredentialsForm))
