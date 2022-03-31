import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Switch } from '@material-ui/core'
import { get } from 'lodash'
import clsx from 'clsx'
// src
import { AlertLevelLabel } from 'ambient_ui'
import ActivePulse from 'components/ActivePulse'
import { Can } from 'rbac'
import ConfirmDialog from 'components/ConfirmDialog'
import { toggleAlertStatusRequested } from 'redux/contextGraph/actions'
import { SeverityToReadableTextEnum } from 'enums'
import { useFlexStyles } from 'common/styles/commonStyles'

import { getThreatCanonicalId } from '../../../../utils/getThreatCanonicalId'

function TitleBar() {
  const [
    toggleAlertStatusModalOpened,
    setToggleAlertStatusModalOpened,
  ] = useState(false)
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()
  const detailedAlert = useSelector(state => state.contextGraph.detailed)
  const severity =
    SeverityToReadableTextEnum[get(detailedAlert, 'defaultAlert.severity', '')]
  const isActive = detailedAlert && detailedAlert.status === 'active'
  const editLoading = useSelector(state => state.contextGraph.editLoading)

  return (
    <>
      <ConfirmDialog
        open={toggleAlertStatusModalOpened}
        onClose={() => {
          setToggleAlertStatusModalOpened(false)
        }}
        onConfirm={() => {
          dispatch(
            toggleAlertStatusRequested({
              id: detailedAlert.id,
            }),
          )
          setToggleAlertStatusModalOpened(false)
        }}
        loading={editLoading}
        content={`Are you sure you want to ${
          isActive ? 'disable' : 'enable'
        } this threat signature?`}
      />
      <Box>
        <div className={clsx(flexClasses.row, flexClasses.centerBetween)}>
          <div
            className={clsx(flexClasses.row, flexClasses.centerAll)}
            style={{ marginLeft: -8 }}
          >
            <AlertLevelLabel level={severity} label={severity} />
            <span className='am-h5'>{detailedAlert.name}</span>
          </div>
          <div
            className={clsx(flexClasses.row, flexClasses.centerAll)}
            style={{ marginLeft: 16 }}
          >
            <ActivePulse isActive={isActive} />
            <span className='am-overline'>
              {isActive ? 'Active' : 'Inactive'}
            </span>
            <Can I='update' on='ContextGraph' passThrough>
              {can => (
                <Switch
                  color='primary'
                  checked={isActive}
                  onChange={() => {
                    setToggleAlertStatusModalOpened(true)
                  }}
                  disabled={!can}
                />
              )}
            </Can>
          </div>
        </div>
        <div>
          <span className='am-overline'>
            {getThreatCanonicalId(detailedAlert)}
          </span>
        </div>
      </Box>
    </>
  )
}

TitleBar.propTypes = {}
export default TitleBar
