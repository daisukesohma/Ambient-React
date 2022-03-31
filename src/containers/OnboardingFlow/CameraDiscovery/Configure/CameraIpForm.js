import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Formik, Form, FieldArray } from 'formik'
import TextField from '@material-ui/core/TextField'
import { Button } from 'ambient_ui'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import * as yup from 'yup'
import get from 'lodash/get'
import IP_VALIDATOR from 'common/validators/ip'
import PORTS_VALIDATOR from 'common/validators/ports'

import { useStyles } from '../../common/styles'

const cameraSchema = yup.object().shape({
  requests: yup.array().of(
    yup.object().shape({
      ip: yup
        .string()
        .matches(IP_VALIDATOR, {
          excludeEmptyString: true,
          message: 'Enter a valid IP, IP Range, or Subnet',
        })
        .required('Ip, IP Range or Subnet required'),
      ports: yup
        .string()
        .matches(PORTS_VALIDATOR, {
          excludeEmptyString: true,
          message: 'Enter valid ports 1-65535, comma separated (ie. 554, 700)',
        })
        .required('Enter valid ports 1-65535, comma separated (ie. 554, 700)'),
    }),
  ),
})

function IpTooltipContent() {
  return (
    <>
      <div style={{ fontSize: 12 }}>
        <h4>Valid formats:</h4>
        <div style={{ marginBottom: 5 }}>IP: 124.1.5.10</div>
        <div style={{ marginBottom: 5 }}>
          IP Range: 124.1.5.10-124.10.10.20 (Note: no spaces)
        </div>
        <div style={{ marginBottom: 5 }}>Subnet: 124.1.5.10/24</div>
      </div>
    </>
  )
}

function PortTooltipContent() {
  return (
    <>
      <div style={{ fontSize: 12 }}>
        <h4>Add more ports by comma separating them.</h4>
        <div>554,700</div>
      </div>
    </>
  )
}

const defaultIp = {
  ip: '',
  ports: '554', // comma-separated list of ports numbers
}

//
// FieldArray Formik example code adapted:
// https://gist.github.com/rossbulat/229a16fd50a18803e90d624ad1413511
const CameraIpForm = ({
  handleNext,
  match: {
    params: { nodeId },
  },
}) => {
  const classes = useStyles()

  function handleSubmit(values, actions) {
    actions.setSubmitting(false)
  }

  const requests = [defaultIp]

  // Returns an object that is in graphql shape
  //
  function getSubmitObj(configs) {
    const ipObj = groupIpsAndSubnets(configs)
    return {
      nodeIdentifier: nodeId,
      request: ipObj, // for graphql submit, we want JSON.stringify this twice, however, we will be collecting credentials first before we send to gql
      status: 'incomplete',
    }
  }

  // inputs array of config objects (hook state obj) and outputs
  // { ips: [{ip: , ports: }], subnets: [...]}
  //
  function groupIpsAndSubnets(configs) {
    const grouped = {
      ips: [],
      subnets: [],
    }

    // configs is hook state object
    configs.forEach(config => {
      if (config.ip.includes('/')) {
        grouped.subnets.push(config)
      } else {
        grouped.ips.push(config)
      }
    })

    return grouped
  }

  return (
    <>
      <Formik
        validationSchema={cameraSchema}
        initialValues={{
          requests,
        }}
        onSubmit={handleSubmit}
        /* eslint-disable react/prop-types */
        render={({
          values,
          errors,
          status,
          touched,
          handleBlur,
          handleChange,
          isSubmitting,
        }) => {
          // Also, we can make hasErrors better by checking if all values exist (ip and ports)
          // Loop thru values.requests.forEach(r => r.ip && r.ports have values)

          // const hasErrors = !!(errors.requests) // PREVIOUS check
          const hasErrors =
            get(errors, 'requests') && errors.requests.filter(e => e).length > 0

          return (
            <Form>
              <FieldArray
                name='requests'
                render={arrayHelpers => (
                  <div>
                    {values.requests.map((request, index) => {
                      const errorAtIndex =
                        errors.requests && get(errors.requests, `[${index}]`)
                      const touchedAtIndex =
                        touched.requests && get(touched.requests, `[${index}]`)
                      const showErrorIp =
                        get(errorAtIndex, 'ip') && get(touchedAtIndex, 'ip')
                      const showErrorPorts =
                        get(errorAtIndex, 'ports') &&
                        get(touchedAtIndex, 'ports')

                      return (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Tooltip
                            placement='right-start'
                            title={<IpTooltipContent />}
                          >
                            <TextField
                              required
                              label='IP, Range, or Subnet'
                              name={`requests.${index}.ip`}
                              className={classes.textField}
                              value={request.ip}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={showErrorIp}
                              helperText={showErrorIp && errorAtIndex.ip}
                              margin='normal'
                              variant='outlined'
                            />
                          </Tooltip>
                          <Tooltip
                            placement='right-start'
                            title={<PortTooltipContent />}
                          >
                            <TextField
                              required
                              label='Ports'
                              name={`requests.${index}.ports`}
                              className={classes.textField}
                              value={request.ports}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={showErrorPorts}
                              helperText={showErrorPorts && errorAtIndex.ports}
                              margin='normal'
                              variant='outlined'
                            />
                          </Tooltip>
                          {values.requests.length > 1 && (
                            <div
                              onClick={() => arrayHelpers.remove(index)}
                              style={{ paddingTop: 30 }}
                            >
                              <IconButton size='small'>
                                <DeleteIcon fontSize='small' />
                              </IconButton>
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {/* Add a new empty IP request at the end of the list */}
                    <Button
                      size='small'
                      variant='outlined'
                      onClick={() => arrayHelpers.push(defaultIp)}
                    >
                      Add IP
                    </Button>
                    <div
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Button
                        disabled={hasErrors} // if has errors, disable
                        size='small'
                        onClick={handleNext(getSubmitObj(values.requests))}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              />
            </Form>
          )
        }}
      />
    </>
  )
}
/* eslint-enable react/prop-types */

CameraIpForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      nodeId: PropTypes.string,
    }),
  }),
  handleNext: PropTypes.func,
}

CameraIpForm.defaultTypes = {
  match: {
    params: {
      nodeId: '',
    },
  },
  handleNext: () => {},
}

export default withRouter(CameraIpForm)
