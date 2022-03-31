import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import get from 'lodash/get'
import { motion, AnimatePresence } from 'framer-motion'
// src
import { SearchableSelectDropdown } from 'ambient_ui'
import { upperFirst } from 'utils'
import selectedSkuForNodeProvision from 'pages/SkuManagement/selectors/selectedSkuForNodeProvision'

import useStyles from './styles'

interface Props {
  quantity: number
}

function DetailsPanel({ quantity }: Props): JSX.Element {
  const classes = useStyles({ darkMode: true })
  const skuObject = useSelector(selectedSkuForNodeProvision)
  // // for site
  const [siteType, setSiteType] = useState()
  const [siteTypeObject, setSiteTypeObject] = useState()
  const getSiteTypeOptions = keys => {
    return keys.map(k => ({
      label: upperFirst(k),
      value: k,
    }))
  }

  const onSiteTypeChange = item => {
    setSiteType(item.value)
  }

  useEffect(() => {
    if (skuObject) {
      if (siteType) {
        setSiteTypeObject(
          skuObject.capabilities.find(c => c.siteType.name === siteType),
        )
      } else {
        setSiteTypeObject(get(skuObject, 'capabilities[0]'))
      }
    }
  }, [skuObject, siteType])

  return (
    <AnimatePresence>
      {skuObject && (
        <motion.div
          style={{ width: 350 }}
          initial={{ x: -50, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
            transition: {
              duration: 0.84,
            },
          }}
          exit={{
            x: -50,
            opacity: 1,
            transition: {
              duration: 0.84,
            },
          }}
        >
          <div
            style={{
              color: 'white',
              marginLeft: 16,
              marginTop: 16,
              marginRight: 24,
            }}
          >
            <div className={clsx('am-caption', classes.sectionHeader)}>
              Selected Hardware:
            </div>
            <div className={clsx('am-h5')}>
              <span>{`${skuObject.hardwarePartner.name} ${skuObject.identifier}`}</span>
            </div>
            <div className={clsx('am-subtitle2', classes.spacingBottom)}>
              {`$${skuObject.price} x ${quantity || 1} = $${skuObject.price *
                (quantity || 1)}`}
            </div>
            <div className={clsx('am-caption', classes.sectionHeader)}>
              Details
            </div>
            <div className={classes.spacingBottom} />
            {siteTypeObject && (
              <div className={classes.section}>
                <div
                  className={clsx('am-caption', classes.subtitleHeader)}
                  style={{ alignItems: 'center', marginBottom: 16 }}
                >
                  <span style={{ marginBottom: 8 }}>Site Type:</span>
                  <SearchableSelectDropdown
                    options={getSiteTypeOptions(
                      skuObject.capabilities.map(c => c.siteType.name),
                    )}
                    onChange={onSiteTypeChange}
                    placeholder='Site Type'
                    defaultValue={
                      getSiteTypeOptions(
                        skuObject.capabilities.map(c => c.siteType.name),
                      )[0]
                    }
                  />
                </div>

                <div className='am-caption'>
                  {`${siteTypeObject.numStreams} streams`}
                </div>
                <div className='am-caption'>
                  {`${siteTypeObject.numViewers} max viewers`}
                </div>
                <div className='am-caption'>
                  {`${siteTypeObject.fullDaysRetention} days non-motion retention`}
                </div>
                <div className='am-caption'>
                  {`${siteTypeObject.motionDaysRetention} days motion retention`}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DetailsPanel
