import React, { useEffect } from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@material-ui/core/Box'
// src
import upperFirst from 'utils/text/upperFirst'
import selectedSkuForNodeProvision from 'pages/SkuManagement/selectors/selectedSkuForNodeProvision'
import { fetchSkusRequested } from 'pages/SkuManagement/redux'

import useStyles from './styles'

function TabFour(): JSX.Element {
  const dispatch = useDispatch()
  const classes = useStyles({ darkMode: true })
  const skuObject = useSelector(selectedSkuForNodeProvision)

  // Since this tab / Add Modal is used on Inventory page AND Sku page, they have
  // separate redux states. On Inventory page, we need to requery skus
  useEffect(() => {
    if (!skuObject) {
      dispatch(fetchSkusRequested(null))
    }
  }, [dispatch, skuObject])

  // avoids illegal references
  if (!skuObject) return <></>

  return (
    <>
      <Box p={3}>
        <div style={{ width: 450 }}>
          <div className={clsx(classes.spacingBottom)}>
            <span className='am-h5'>{`${skuObject.hardwarePartner.name} ${skuObject.identifier}`}</span>
          </div>
          <Box mb={1}>
            <div className={clsx('am-caption', classes.sectionHeader)}>GPU</div>
            <div className='am-caption'>{`${skuObject.gpu.name}`}</div>
            <div className='am-caption'>{`${skuObject.numGpu} GPUs`}</div>
          </Box>
          <Box mb={1}>
            <div className={clsx('am-caption', classes.sectionHeader)}>CPU</div>
            <div className='am-caption'>{`${skuObject.cpuBaseClock} GHz`}</div>
            <div className='am-caption'>
              {`${skuObject.cpuThreadCount} threads`}
            </div>
          </Box>
          <Box mb={1}>
            <div className={clsx('am-caption', classes.sectionHeader)}>
              Hardware
            </div>
            <div className='am-caption'>{`${skuObject.memory} GB RAM`}</div>
            <div className='am-caption'>
              {`${skuObject.hddStorage / 1000} TB HDD`}
            </div>
            <div className='am-caption'>{`${skuObject.ssdStorage} GB SSD`}</div>
          </Box>
          <Box mb={1}>
            <div className={clsx('am-caption', classes.sectionHeader)}>
              Info
            </div>
            <div className='am-caption'>
              {skuObject.hardwareInfo
                .replace(/\n/gi, '\n')
                .split('\n')
                .map((info: string) => {
                  return (
                    <div key={`${skuObject.id}-${info}`}>
                      {upperFirst(info)}
                    </div>
                  )
                })}
            </div>
          </Box>
        </div>
      </Box>
    </>
  )
}

export default TabFour
