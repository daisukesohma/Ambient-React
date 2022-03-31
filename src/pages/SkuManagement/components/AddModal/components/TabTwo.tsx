import React from 'react'
import Box from '@material-ui/core/Box'
// src
import TextFieldAmbient from 'components/TextFieldAmbient'

interface Props {
  formik: any
}

function TabTwo({ formik }: Props): JSX.Element {
  return (
    <>
      <Box p={3}>
        <div style={{ width: 450 }}>
          <TextFieldAmbient
            placeholder='Welcome user email'
            label='Welcome user email'
            id='welcomeUserEmail'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            placeholder='Shipping Info (Destination)'
            id='shippingInfo'
            onChange={formik.handleChange}
            label='Shipping Info (Destination)'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            placeholder='Purchase order'
            id='purchaseOrder'
            onChange={formik.handleChange}
            label='Purchase order'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            placeholder='Comment'
            id='comment'
            onChange={formik.handleChange}
            label='Comment'
            withFormik
            formikObject={formik}
          />
        </div>
      </Box>
    </>
  )
}

export default TabTwo
