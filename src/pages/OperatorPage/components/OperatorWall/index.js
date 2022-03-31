import React, { useEffect, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { get, find, map, isEmpty, parseInt, omit } from 'lodash'
import clsx from 'clsx'
import { DropdownMenu, SearchableSelectDropdown, Icons } from 'ambient_ui'
import { Grid } from '@material-ui/core'
import { Droppable } from 'react-beautiful-dnd'
// src
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import {
  updateVideoWallRequested,
  selectVideoWallTemplate,
  toggleStreamCell,
  updateStreamFeedRequested,
  toggleTopBarPanel,
  fetchVideoWallSucceeded,
} from '../../../../redux/slices/operatorPage'
import VideoWallCell from '../VideoWallCell'
import VideoWallTemplateSelector from '../VideoWallTemplateSelector'
import streamsDropDown from '../../../../selectors/operatorPage/streams-drop-down'
import SecurityProfileSelector from '../SecurityProfileSelector'
import getStreamByCell from '../utils/getStreamByCell'
import VideoWallPlayer from '../../../../components/VideoWallPlayer'
import SecurityPosturePanel from '../../../../features/SecurityPosturePanel'
import useFeature from '../../../../common/hooks/useFeature'
import SiteSelector from '../SiteSelector'
import PauseAlertModal from 'components/organisms/PauseAlertModal'
import SubmitAlertModal from 'components/organisms/SubmitAlertModal'
import NoFacialRecognitionModal from 'components/organisms/modals/NoFacialRecognitionModal'

import useStyles from './styles'
import useMixpanel from '../../../../mixpanel/hooks/useMixpanel'
import { MixPanelEventEnum } from '../../../../enums'

const { ArrowUp, ArrowDown } = Icons

const selectOptions = [
  {
    value: 'security-profile',
    label: 'Security Profile',
  },
  {
    value: 'video-wall-layouts',
    label: 'Video Wall Layouts',
  },
]

function OperatorWall() {
  const { palette } = useTheme()
  const { account } = useParams()
  const dispatch = useDispatch()

  const darkMode = useSelector(state => state.settings.darkMode)
  const activeVideoWall = useSelector(state => state.operatorPage.videoWall)
  const sites = useSelector(state => state.operatorPage.sites)
  const topBarPanelOpened = useSelector(
    state => state.operatorPage.topBarPanelOpened,
  )
  const streams = useSelector(streamsDropDown)
  const [globalSelectedSite, setGlobalSelectedSite] = useGlobalSelectedSite()

  useMixpanel(MixPanelEventEnum.VIDEO_WALL_OPENED, {
    videoWallId: activeVideoWall.id,
  })

  const isVideoWallPlayerActive = useFeature({
    accountSlug: account,
    feature: 'VIDEO_WALL_PLAYER',
  })

  const [selected, setSelected] = useState(selectOptions[0])

  const classes = useStyles({ topBarPanelOpened, activeVideoWall })

  const onTemplateSelect = template => {
    dispatch(selectVideoWallTemplate({ template }))
    dispatch(updateVideoWallRequested())
  }

  const onChangeStream = (orderIndex, stream) => {
    dispatch(toggleStreamCell({ orderIndex, stream }))
    const params = {
      videoWallId: parseInt(get(activeVideoWall, 'id')),
      orderIndex,
    }
    if (!isEmpty(stream)) params.streamId = stream.id
    dispatch(updateStreamFeedRequested(params))
  }

  const siteOptions = map(sites, site => ({
    value: site.slug,
    label: site.name,
  }))

  const handleOptionSelect = option => setSelected(option)

  const handleSiteSelect = option => setGlobalSelectedSite(option.value)

  useEffect(() => {
    // check if selected site exists in the array
    if (
      sites &&
      sites.length &&
      (!globalSelectedSite || !find(sites, { slug: globalSelectedSite }))
    ) {
      setGlobalSelectedSite(sites[0].slug)
    }
  }, [sites, dispatch])

  const iconProps = {
    stroke: palette.common.white,
    width: 24,
    height: 24,
  }

  const handleToggleTopBarPanel = () => {
    dispatch(toggleTopBarPanel())
  }

  const onVideoWallChange = nextVideoWall => {
    dispatch(
      fetchVideoWallSucceeded({
        videoWall: {
          ...activeVideoWall,
          ...omit(nextVideoWall.object, ['id', 'name']),
        },
      }),
    )
  }

  return (
    <div className={classes.videoWallContainer} id='operator-wall-root'>
      {/**
       * TODO(AMB-2276|@rys & @stephen): use organism/modals
       * */}
      <PauseAlertModal darkMode={darkMode} />
      <SubmitAlertModal darkMode={darkMode} />
      <NoFacialRecognitionModal />
      <div className={classes.toolbarWrapper}>
        <div className={classes.toolbar}>
          <DropdownMenu
            menuItems={selectOptions}
            selectedItem={selected}
            handleSelection={handleOptionSelect}
            classOverride={classes.optionSelector}
          />
          {selected.value === selectOptions[0].value && (
            <SearchableSelectDropdown
              options={siteOptions}
              value={find(siteOptions, { value: globalSelectedSite })}
              onChange={handleSiteSelect}
              classOverride={classes.optionSelector}
            />
          )}
          <Grid container>
            {selected.value === selectOptions[1].value ? (
              <VideoWallTemplateSelector
                activeVideoWall={activeVideoWall}
                onTemplateSelect={onTemplateSelect}
              />
            ) : (
              <div className={classes.profileSelectorWrapper}>
                <SecurityProfileSelector showAsDropdown />
              </div>
            )}
          </Grid>
        </div>
        <div
          className={classes.displayController}
          onClick={handleToggleTopBarPanel}
        >
          {topBarPanelOpened ? (
            <ArrowUp {...iconProps} />
          ) : (
            <ArrowDown {...iconProps} />
          )}
        </div>
      </div>
      {!isEmpty(activeVideoWall) && !isEmpty(activeVideoWall.template) && (
        <div className={classes.gridContainer}>
          {activeVideoWall.template.shape.map((cell, orderIndex) => {
            const selectedStream = getStreamByCell(
              streams,
              activeVideoWall.streamFeeds,
              orderIndex,
            )
            return (
              <Droppable
                key={orderIndex}
                droppableId={`${orderIndex}-${get(selectedStream, 'streamId')}`}
              >
                {(provided, snapshot) => {
                  return (
                    <div
                      key={`video-wall-cell-${orderIndex}`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        gridRowStart: cell[0] + 1,
                        gridColumnStart: cell[1] + 1,
                        gridRowEnd: cell[2] + 1,
                        gridColumnEnd: cell[3] + 1,
                      }}
                      className={clsx(classes.gridItem, {
                        [classes.isDroppableActive]: snapshot.isDraggingOver,
                      })}
                    >
                      <VideoWallCell
                        streams={streams}
                        cell={cell}
                        orderIndex={orderIndex}
                        onChangeStream={onChangeStream}
                        selectedStream={selectedStream}
                        timezone={get(
                          selectedStream,
                          'timezone',
                          DEFAULT_TIMEZONE,
                        )}
                      />
                      {provided.placeholder}
                    </div>
                  )
                }}
              </Droppable>
            )
          })}
        </div>
      )}

      <div className={classes.bottomToolbar}>
        {isVideoWallPlayerActive && (
          <VideoWallPlayer onVideoWallChange={onVideoWallChange} />
        )}
        <SecurityPosturePanel
          onVideoWallChange={onVideoWallChange}
          handleOptionSelect={handleOptionSelect}
          selectedSite={globalSelectedSite}
          selected={selected}
          selectOptions={selectOptions}
          darkMode={darkMode}
          siteOptions={siteOptions}
          handleSiteSelect={handleSiteSelect}
          dropDownClasses={classes}
          activeVideoWall={activeVideoWall}
          onTemplateSelect={onTemplateSelect}
        />
        <SiteSelector />
      </div>
    </div>
  )
}

export default OperatorWall
