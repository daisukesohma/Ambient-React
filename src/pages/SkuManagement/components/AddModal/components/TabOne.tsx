import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@material-ui/core/Box'
import map from 'lodash/map'
// src
import {
  setProvisionNewModalValue,
  SkuReducerProps,
} from 'pages/SkuManagement/redux'
import { DropdownMenu } from 'ambient_ui'
import TextFieldAmbient from 'components/TextFieldAmbient'

interface Props {
  formik: any
}

function TabOne({ formik }: Props): JSX.Element {
  const dispatch = useDispatch()
  const skus = useSelector(
    (state: SkuReducerProps) => state.skuManagement.collection,
  )
  const skuOptions = map(skus, s => ({ label: s.identifier, value: s.id }), [])

  const handleSkuSelection = e => {
    formik.setFieldValue('skuId', e.value)
    dispatch(setProvisionNewModalValue({ id: e.value }))
  }

  return (
    <>
      <Box p={3}>
        <TextFieldAmbient
          placeholder='Hardware Partner'
          disabled
          label='Hardware Partner'
          id='hardwarePartner'
          withFormik
          formikObject={formik}
        />
        <div style={{ width: 450 }}>
          <div style={{ marginBottom: 16, marginTop: -8 }}>
            <div className='am-caption' style={{ marginBottom: 8 }}>
              SKU
            </div>
            <div style={{ marginLeft: -8 }}>
              <DropdownMenu
                labelWidth={450 - 48}
                menuItems={skuOptions}
                selectedItem={skuOptions.find(
                  item =>
                    parseInt(item.value, 10) ===
                    parseInt(formik.values.skuId, 10),
                )}
                handleSelection={handleSkuSelection}
              />
            </div>
          </div>
          <TextFieldAmbient
            placeholder='Node identifier'
            required
            label='Node identifier'
            id='nodeIdentifier'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            placeholder='Motion Retention Days'
            id='retentionMotionDays'
            onChange={formik.handleChange}
            label='Motion Retention Days'
            withFormik
            formikObject={formik}
          />
          <TextFieldAmbient
            placeholder='Nonmotion Retention Days'
            id='retentionNonmotionDays'
            onChange={formik.handleChange}
            label='Nonmotion Retention Days'
            withFormik
            formikObject={formik}
          />
        </div>
      </Box>
    </>
  )
}

export default TabOne
