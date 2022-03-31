import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useSelector, useDispatch, batch } from 'react-redux'
import clsx from 'clsx'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
// src
import { Button, Icon } from 'ambient_ui'
import { setSelectedIndex, reset, setIsOpen } from 'redux/slices/reId'
import { useFlexStyles, useCursorStyles } from 'common/styles/commonStyles'
import { hideModal, showModal } from 'redux/slices/modal'
import { setIsReIdSearchVisible } from 'redux/forensics/actions'
import Tooltip from 'components/Tooltip'

import useReIdData from './hooks/useReIdData'
import ReIdSnapshot from './components/ReIdSnapshot'
import useStyles from './styles'

const propTypes = {
  darkMode: PropTypes.bool,
  isMini: PropTypes.bool,
  account: PropTypes.string,
}

const defaultProps = {
  darkMode: false,
  isMini: false,
  account: null,
}

// There are two places where this appears.
// isMini=true  is the small selector, currently found on the Forensics page in place of the search bar.
// isMini =false is the large selector, seen in the VMS controls.
//
// NOTE:
// can fire this off : dispatch(setIsReIdSearchVisible(false))
// at the time as the VMS Selector closing it
//
const ReIdSelector = ({ darkMode, isMini, account }) => {
  const { palette } = useTheme()
  const history = useHistory()
  const classes = useStyles({ darkMode, isMini })
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const dispatch = useDispatch()
  const vectors = useSelector(state => state.reId.snapshotData)
  const selectedIndex = useSelector(state => state.reId.selectedIndex)
  const queryTs = useSelector(state => state.reId.queryTs)
  const modalData = useSelector(state => state.reId.selectedModal)
  const { searchForensics } = useReIdData()

  const handleSearchInVmsModal = () => {
    batch(() => {
      dispatch(hideModal())
      dispatch(setIsReIdSearchVisible(true))
      searchForensics()
    })
    if (account) {
      history.push(`/accounts/${account}/forensics`)
    }
  }

  // for both Vms and Mini (Forensics Search)
  const handleClose = () => {
    batch(() => {
      dispatch(setIsReIdSearchVisible(false))
      dispatch(reset())
      dispatch(setIsOpen(false))
    })
  }

  const handleMiniSnapshotClick = index => {
    dispatch(setSelectedIndex(index))
    searchForensics(index)
  }

  return (
    <div id='reId-selector-root' className={classes.root}>
      {!isMini && (
        <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
          <div className={clsx('am-subtitle2', classes.personSearchTitle)}>
            Person Search
          </div>
          <div className={clsx('am-caption', classes.timeSearched)}>
            Searched {moment.unix(queryTs).format('HH:mm:ssA')}
          </div>
        </div>
      )}
      <div className={clsx(classes.close, cursorClasses.pointer)}>
        <div onClick={handleClose}>
          <Icon icon='close' size={18} color={palette.grey[500]} />
        </div>
        {isMini && modalData && (
          <Tooltip content='Open Stream'>
            <div onClick={() => dispatch(showModal(modalData))}>
              <Icon icon='eye' size={18} color={palette.grey[500]} />
            </div>
          </Tooltip>
        )}
      </div>
      {!isEmpty(vectors) && (
        <div>
          <div className={clsx(flexClasses.row, classes.vectorRow)}>
            {vectors.map((v, index) => (
              <div
                key={`reId-snapshot-${index}`}
                className={clsx(
                  cursorClasses.pointer,
                  classes.snapshotContainer,
                )}
                onClick={() => {
                  if (isMini) {
                    handleMiniSnapshotClick(index)
                  } else {
                    dispatch(setSelectedIndex(index))
                  }
                }}
              >
                <ReIdSnapshot
                  data={v}
                  isSelected={selectedIndex === index}
                  isMini={isMini}
                />
              </div>
            ))}
          </div>
          {!isMini && (
            <div>
              <Button
                onClick={handleSearchInVmsModal}
                disabled={selectedIndex === null}
              >
                Search
              </Button>
            </div>
          )}
        </div>
      )}
      {isEmpty(vectors) && (
        <div
          className={clsx(
            'am-body1',
            classes.emptyContent,
            flexClasses.row,
            flexClasses.centerAll,
          )}
        >
          There are no people found within the time searched.
        </div>
      )}
    </div>
  )
}

ReIdSelector.propTypes = propTypes
ReIdSelector.defaultProps = defaultProps

export default ReIdSelector
