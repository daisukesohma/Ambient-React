import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
// import PropTypes from 'prop-types'
import Ticker from 'react-ticker'
import { useSelector, useDispatch } from 'react-redux'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
// import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
// import truncate from 'lodash/truncate'
// import parseInt from 'lodash/parseInt'
import {
  ExpandLess,
  ExpandMore,
  // ChevronLeft,
  // ChevronRight,
} from '@material-ui/icons'
import { Box, IconButton, Modal } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useHover } from 'react-use-gesture'

// import { DropdownMenu } from '../../ambient_ui'
import Tooltip from '../../components/Tooltip'
import TooltipText from '../../components/Tooltip/TooltipText'
// import usePrevious from '../../common/hooks/usePrevious'
// import VideoWallTemplateSelector from '../../containers/OperatorPage/components/VideoWallTemplateSelector'
// import SecurityProfileSelector from '../../containers/OperatorPage/components/SecurityProfileSelector'
import useInterval from '../../common/hooks/useInterval'

import {
  toggleBar,
  getThreatSignaturePausePeriodsRequested,
  cancelThreatSignaturePausePeriodRequested,
  clearOptions,
  toggleModal,
  toggleCancelModal,
} from './securityPosturePanelSlice'
import useStyles from './styles'
import SecurityPostureCard from './components/SecurityPostureCard'
import SecurityPostureModalLayout from './components/SecurityPostureModalLayout'
import CancelPauseModalLayout from './components/CancelPauseModalLayout'

// const propTypes = {
//   onVideoWallChange: PropTypes.func,
//   handleOptionSelect: PropTypes.func,
//   selectedSite: PropTypes.string,
//   selected: PropTypes.string,
//   selectOptions: PropTypes.array,
//   siteOptions: PropTypes.array,
//   handleSiteSelect: PropTypes.func,
//   dropDownClasses: PropTypes.array,
//   onTemplateSelect: PropTypes.func,
// }

// const defaultProps = {
//   onVideoWallChange: () => {},
//   handleOptionSelect: () => {},
//   selectedSite: '',
//   selected: '',
//   selectOptions: [],
//   siteOptions: [],
//   handleSiteSelect: () => {},
//   dropDownClasses: [],
//   onTemplateSelect: () => {},
// }

function SecurityPosturePanel() {
  //   {
  //   onVideoWallChange,
  //   handleOptionSelect,
  //   selectedSite,
  //   selected,
  //   selectOptions,
  //   siteOptions,
  //   handleSiteSelect,
  //   dropDownClasses,
  //   onTemplateSelect,
  // }
  const dispatch = useDispatch()
  const { account } = useParams()

  const darkMode = useSelector(state => state.settings.darkMode)
  // const activeVideoWall = useSelector(
  //   state => state.videoWallPlayer.activeVideoWall,
  // )
  const isOpened = useSelector(state => state.securityPosturePanel.isOpened)
  const [mounted, setMounted] = useState(true)
  const [pausePeriodToDelete, setPausePeriodToDelete] = useState(null)
  const threatSignaturePausePeriods = useSelector(
    state => state.securityPosturePanel.threatSignaturePausePeriods,
  )
  const classes = useStyles({ darkMode, isOpened })
  const modalOpen = useSelector(state => state.securityPosturePanel.modalOpen)
  const cancelModalOpen = useSelector(
    state => state.securityPosturePanel.cancelModalOpen,
  )

  // const prevActiveVideoWall = usePrevious(activeVideoWall)

  const [showControls, setShowControls] = useState(false)

  // const [switchMenu, setSwitch] = useState(true)

  const numThreatSignaturePausePeriods = threatSignaturePausePeriods
    ? threatSignaturePausePeriods.length
    : 0

  const tickerLabel = useMemo(() => {
    if (numThreatSignaturePausePeriods === 1) {
      return `${numThreatSignaturePausePeriods} instance paused`
    }
    if (numThreatSignaturePausePeriods > 1) {
      return `${numThreatSignaturePausePeriods} instances paused`
    }
    return 'No instances paused'
  }, [numThreatSignaturePausePeriods])

  // useEffect(() => {
  //   setCurrentDuration(duration)
  // }, [duration])

  // useEffect(() => {
  //   if (
  //     !isEmpty(activeVideoWall) &&
  //     get(prevActiveVideoWall, 'id') !== get(activeVideoWall, 'id')
  //   ) {
  //     onVideoWallChange(activeVideoWall)
  //   }
  // }, [activeVideoWall, onVideoWallChange, prevActiveVideoWall])

  useEffect(() => {
    if (isOpened && mounted) {
      dispatch(toggleBar())
      setMounted(false)
    } else if (!isOpened && mounted) {
      setMounted(false)
    }
  }, [dispatch, isOpened, mounted])

  useEffect(() => {
    dispatch(getThreatSignaturePausePeriodsRequested({ accountSlug: account }))
  }, [dispatch, account])

  useInterval(() => {
    dispatch(getThreatSignaturePausePeriodsRequested({ accountSlug: account }))
  }, 1000 * 60)

  // useInterval(() => {
  //   console.log(getUnixTime(new Date()))
  // }, 1000)

  // const handleSwitch = () => {
  //   setSwitch(!switchMenu)
  // }

  const hover = useHover(({ hovering }) => {
    if (hovering) {
      setShowControls(true)
    } else if (!isOpened) {
      setShowControls(false)
    }
  })

  const handleToggleBar = useCallback(() => {
    if (isOpened) {
      setShowControls(false)
    }
    dispatch(toggleBar())
  }, [dispatch, setShowControls, isOpened])

  const handleDeletePause = id => {
    dispatch(toggleCancelModal({ id }))
  }

  const cancelDeletePause = () => {
    dispatch(toggleCancelModal({ id: null }))
  }

  const handleModalOpen = () => {
    dispatch(toggleModal())
    dispatch(clearOptions())
  }

  const handleModalClose = () => {
    dispatch(toggleModal())
    dispatch(clearOptions())
  }

  return (
    <div className={classes.root} {...hover()}>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <>
          <SecurityPostureModalLayout />
        </>
      </Modal>
      <Modal open={cancelModalOpen} onClose={cancelDeletePause}>
        <>
          <CancelPauseModalLayout />
        </>
      </Modal>
      <Grid
        container
        direction='row'
        justify='space-between'
        alignItems='center'
        className={classes.header}
      >
        {showControls && (
          <Grid
            container
            direction='row'
            justify='space-between'
            alignItems='flex-start'
            className={classes.controls}
          >
            {/* ------TODO--------
            <Tooltip
              placement='top'
              content={<TooltipText text={'Go to previous Video Wall'} />}
            >
              <ChevronLeft onClick={handleSwitch} className={classes.icon} />
            </Tooltip> */}

            {/* {switchMenu ? (
              <Grid item className={classes.temp}>
                Pause Threat Signature
              </Grid>
            ) : (
              <Grid item className={classes.top}>
                Override Security Profile
              </Grid>
            )} */}
            {/* <Tooltip
              placement='top'
              content={<TooltipText text={'Go to next Video Wall'} />}
            >
              <ChevronRight onClick={handleSwitch} className={classes.icon} />
            </Tooltip> */}
            <Grid item className={classes.temp}>
              Pause Threat Signature
            </Grid>

            {isOpened ? (
              <ExpandMore onClick={handleToggleBar} className={classes.icon} />
            ) : (
              <ExpandLess onClick={handleToggleBar} className={classes.icon} />
            )}
          </Grid>
        )}
        <Grid item xs={12} className={classes.progress}>
          <Box className={classes.tickerContainer}>
            {numThreatSignaturePausePeriods > 0 ? (
              <Ticker height={20} speed={7} mode='smooth' move>
                {() => (
                  <div
                    className={clsx('am-overline', classes.wallRotationLabel)}
                  >
                    {tickerLabel}
                  </div>
                )}
              </Ticker>
            ) : (
              <div className={classes.idleContainer}>
                <div className={clsx('am-overline', classes.idleLabel)}>
                  {tickerLabel}
                </div>
              </div>
            )}
          </Box>
          <LinearProgress color='secondary' variant='determinate' value={0} />
        </Grid>
      </Grid>
      {/* {isOpened && switchMenu && ( */}
      {isOpened && (
        <Grid className={classes.body}>
          <Grid container direction='column' className={classes.column}>
            <Grid
              item
              className={classes.groupHeader}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              Paused Threat Signatures
              <div>
                <Tooltip
                  placement='top'
                  className={classes.nameBlock}
                  content={<TooltipText text='Pause Threat Signature' />}
                >
                  <IconButton onClick={handleModalOpen}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Grid>
            {isEmpty(threatSignaturePausePeriods) ? (
              <Grid container justify='center' className={classes.emptyList}>
                No Paused Threat Signatures
              </Grid>
            ) : (
              threatSignaturePausePeriods.map(threatSignaturePausePeriod => (
                <div
                  className={classes.card}
                  key={threatSignaturePausePeriod.id}
                >
                  <SecurityPostureCard
                    cardKey={threatSignaturePausePeriod.id}
                    threatSignaturePausePeriod={threatSignaturePausePeriod}
                    handleDeletePause={handleDeletePause}
                    classes={classes}
                    darkMode={darkMode}
                  />
                </div>
              ))
            )}
          </Grid>
        </Grid>
      )}
      {/* ------TODO--------
      {isOpened && !switchMenu && (
        <Grid className={classes.body}>
          <Grid container direction='column' className={classes.column}>
            <Grid item className={classes.groupHeader}>
              Snoozed Alerts
            </Grid>
            <DropdownMenu
              menuItems={selectOptions}
              selectedItem={selected}
              handleSelection={handleOptionSelect}
              darkMode={darkMode}
              classOverride={dropDownClasses.optionSelector}
            />
            ) && (selected.value === selectOptions[0].value && (
            <DropdownMenu
              menuItems={siteOptions}
              selectedItem={siteOptions.find(
                item => item.value === selectedSite,
              )}
              handleSelection={handleSiteSelect}
              darkMode={darkMode}
            />
            )) && (
            <Grid container>
              {selected.value === selectOptions[1].value ? (
                <VideoWallTemplateSelector
                  activeVideoWall={activeVideoWall}
                  onTemplateSelect={onTemplateSelect}
                />
              ) : (
                <div className={dropDownClasses.profileSelectorWrapper}>
                  <SecurityProfileSelector showAsDropdown={true} />
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
      )} */}
    </div>
  )
}

// SecurityPosturePanel.propTypes = propTypes

// SecurityPosturePanel.defaultProps = defaultProps

export default SecurityPosturePanel
