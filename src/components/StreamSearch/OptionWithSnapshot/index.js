import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import { components } from 'react-select'

import Tooltip from 'components/Tooltip'
import { fetchStreamSnapShotRequested } from 'redux/slices/operatorPage'
import OverflowTip from 'components/OverflowTip'
import SimpleLabel from 'components/Label/SimpleLabel'

import useStyles from './styles'

const propTypes = {
  data: PropTypes.object,
}

function OptionWithSnapshot(props) {
  const { palette } = useTheme()
  const {
    data: { streamName, regionName, siteName },
  } = props
  const dispatch = useDispatch()
  const classes = useStyles()

  const renderContent = () => {
    if (props.data.snapshotLoading) return 'Loading Snapshot...'
    if (isEmpty(props.data.snapshot)) return 'No Snapshot Available'
    return (
      <img
        alt=''
        style={{ width: 200, height: 150 }}
        src={props.data.snapshot}
      />
    )
  }

  return (
    <Tooltip
      placement='left'
      theme='ambient-dark'
      onShow={() => {
        if (
          props.data.snapshotLoading ||
          !isEmpty(props.data.snapshot) ||
          props.data.serverSide
        )
          return true
        return dispatch(
          fetchStreamSnapShotRequested({ streamId: props.data.value }),
        )
      }}
      content={renderContent()}
    >
      <components.Option {...props}>
        <div className={classes.root}>
          <OverflowTip text={streamName} width='100%' />
          <div className={classes.chips}>
            {siteName && (
              <div className={classes.chip}>
                <SimpleLabel color={palette.grey[700]} inlineTooltip>
                  {siteName}
                </SimpleLabel>
              </div>
            )}
            {regionName && (
              <div className={classes.chip}>
                <SimpleLabel color={palette.grey[700]} inlineTooltip>
                  {regionName}
                </SimpleLabel>
              </div>
            )}
          </div>
        </div>
      </components.Option>
    </Tooltip>
  )
}

OptionWithSnapshot.propTypes = propTypes

export default OptionWithSnapshot
