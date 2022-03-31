import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Icons, LabelledSliderSwitch } from 'ambient_ui'
import { Grid, Typography, IconButton, Modal } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useSelector, useDispatch } from 'react-redux'

import {
  createCampaignModalOpen,
  createCampaignModalClose,
  toggleSlider,
} from '../../redux/dataInfraSlice'

import CampaignsContainer from './CampaignsContainer'
import CreateCampaignModal from './CreateCampaignModal'
import useStyles from './styles'

const { ArrowUp, ArrowDown } = Icons

function CampaignsPanel() {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const dispatch = useDispatch()
  const [isExpanded, setIsExpanded] = useState(false)
  const createCampaignModalOpened = useSelector(
    state => state.dataInfra.createCampaignModalOpened,
  )

  const campaignSwitch = useSelector(state => state.dataInfra.campaignSwitch)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const darkIconContentKnob = 'Archived'
  const lightIconContentKnob = 'Current'

  return (
    <Grid id='history-panel-container' container className={classes.root}>
      <Grid container item className={classes.unexpandedContainer}>
        <Grid className={classes.expandContainer} onClick={toggleExpand}>
          <div className={classes.expander}>
            {isExpanded ? (
              <ArrowDown stroke={palette.common.white} width={40} height={40} />
            ) : (
              <ArrowUp stroke={palette.common.white} width={40} height={40} />
            )}
          </div>
          <span className={classes.expandLabel}>
            {isExpanded ? 'Hide' : 'Expand'}
          </span>
        </Grid>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography className={clsx('am-h5', classes.historyTitle)}>
            Campaign Management
          </Typography>
        </div>
      </Grid>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{
              height: 700,
              width: '100%',
              transition: {
                duration: 0.2,
              },
            }}
            exit={{
              height: 0,
              transition: {
                duration: 0.2,
              },
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0px 40px 0px 50px',
              }}
            >
              <IconButton
                onClick={() => {
                  dispatch(createCampaignModalOpen())
                }}
                classes={{ root: classes.addButton, label: classes.addIcon }}
              >
                <AddIcon />
              </IconButton>
              <div
                onClick={() => {
                  dispatch(toggleSlider())
                }}
              >
                <LabelledSliderSwitch
                  darkIconContent={darkIconContentKnob}
                  lightIconContent={lightIconContentKnob}
                  checked={campaignSwitch}
                />
              </div>
            </div>
            <Grid className={classes.instancesContainer}>
              <Grid>
                <div>
                  <CampaignsContainer />
                </div>
              </Grid>
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>
      <Modal
        open={createCampaignModalOpened}
        onClose={createCampaignModalClose}
      >
        <CreateCampaignModal />
      </Modal>
    </Grid>
  )
}

export default CampaignsPanel
