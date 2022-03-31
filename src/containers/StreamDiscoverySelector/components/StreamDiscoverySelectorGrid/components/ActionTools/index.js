import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Icon } from 'react-icons-kit'
import { chevronLeft } from 'react-icons-kit/feather/chevronLeft'
import Button from '@material-ui/core/Button'
import { LabelledSliderSwitch } from 'ambient_ui'
import { useSelector, useDispatch } from 'react-redux'
import get from 'lodash/get'
import { Can } from 'rbac'

import { useFlexStyles } from 'common/styles/commonStyles'
import { collapseIp as collapseIpAction } from 'redux/streamDiscovery/actions'

function ActionTools({ isMockData, setIsMockData }) {
  const theme = useTheme()
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()

  const handleBack = () => {
    dispatch(collapseIpAction())
  }

  const isExpanded = useSelector(state =>
    get(state, 'streamDiscovery.expandedIp', false),
  )

  return (
    <div
      className={clsx(flexClasses.row, flexClasses.centerBetween)}
      style={{ height: 60 }}
    >
      <div>
        {isExpanded && (
          <Button onClick={handleBack}>
            <span style={{ color: theme.palette.grey[700] }}>
              <Icon icon={chevronLeft} size={18} />
              <span className='am-overline'>Back</span>
            </span>
          </Button>
        )}
      </div>
      <div>
        {!isExpanded && (
          <Can I='is_internal' on='Admin'>
            <LabelledSliderSwitch
              darkIconContent='Mock'
              lightIconContent='Prod'
              checked={isMockData}
              onClick={() => setIsMockData(!isMockData)}
            />
          </Can>
        )}
      </div>
    </div>
  )
}

ActionTools.propTypes = {
  isMockData: PropTypes.bool,
  setIsMockData: PropTypes.func,
}

export default ActionTools
