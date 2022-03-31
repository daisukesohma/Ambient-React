import React from 'react'
import Box from '@material-ui/core/Box'
// src
import TextFieldAmbient from 'components/TextFieldAmbient'

interface Props {
  formik: any
}

function TabThree({ formik }: Props): JSX.Element {
  return (
    <>
      <Box p={3}>
        <div style={{ width: 450 }}>
          <TextFieldAmbient
            placeholder='Static Ip'
            id='staticIp'
            onChange={formik.handleChange}
            label='Static Ip'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            placeholder='Subnet'
            id='subnet'
            onChange={formik.handleChange}
            label='Subnet'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            placeholder='Gateway'
            id='gateway'
            onChange={formik.handleChange}
            label='Gateway'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            placeholder='DNS'
            id='dns'
            onChange={formik.handleChange}
            label='DNS'
            withFormik
            formikObject={formik}
          />
        </div>
      </Box>
    </>
  )
}

export default TabThree
