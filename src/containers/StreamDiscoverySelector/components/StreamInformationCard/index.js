import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import { Icon, DropdownMenu, Icons, CircularProgress } from 'ambient_ui'
import { useDispatch, useSelector } from 'react-redux'
import get from 'lodash/get'
import find from 'lodash/find'
import clsx from 'clsx'
import findIndex from 'lodash/findIndex'
import { SizeMe } from 'react-sizeme'
// src
import { getAccountSlug } from 'utils'
import useSitesByAccount from 'common/hooks/useSitesByAccount'
import Tooltip from 'components/Tooltip'
import MenuItemLabel from 'components/Menus/MenuItemLabel'
import Card from 'components/Cards/variants/BaseCard'
import FooterSingleLine from 'components/Cards/variants/BaseCard/FooterSingleLine'
import HeaderDoubleLine from 'components/Cards/variants/BaseCard/HeaderDoubleLine'
import Content from 'components/Cards/variants/BaseCard/Content'
import {
  addStream as addStreamAction,
  removeStream as removeStreamAction,
  changeStreamName as changeStreamNameAction,
  changeStreamRegion as changeStreamRegionAction,
  changeStreamSite,
  setIsSelectorDirty as setIsSelectorDirtyAction,
  streamDiscoveryFetchThumbnailRequested,
} from 'redux/streamDiscovery/actions'
import regionsFromNodeRequest from 'selectors/streamDiscovery/regionsFromNodeRequest'

import Thumbnail from '../Thumbnail'

import useStyles from './styles'

const { Refresh: RefreshIcon } = Icons

function StreamInformationCard({ headerBottomRight, data }) {
  const theme = useTheme()
  const classes = useStyles()
  const [hovering, setHovering] = useState(false)
  const {
    id,
    cameraIp: ip,
    url: thumbnailUrl,
    streamName: initName,
    streamUrl,
  } = data
  const dispatch = useDispatch()
  const streamsToCreate = useSelector(state =>
    get(state, 'streamDiscovery.streamsToCreate', null),
  )
  const nodeIdentifier = useSelector(state =>
    get(state, 'streamDiscovery.selectedNode.identifier', null),
  )
  const regionOptions = useSelector(regionsFromNodeRequest)
  const accountSlug = getAccountSlug()
  const siteOptionsData = useSitesByAccount(accountSlug)
  const siteOptions = get(siteOptionsData.data, 'length')
    ? siteOptionsData.data
    : []

  const [selectedRegion, setSelectedRegion] = useState(
    regionOptions.length > 0 ? regionOptions[0] : null,
  )
  const [selectedSite, setSelectedSite] = useState(null)

  const siteOptionsLabel = siteOptions.map(({ name, id }) => ({
    label: <MenuItemLabel name={name} type='site' />,
    value: id,
  }))

  useEffect(() => {
    if (siteOptionsLabel.length > 0) {
      setSelectedSite(siteOptionsLabel[0])
    }
  }, [siteOptions])

  const isLoading = useSelector(state => state.streamDiscovery.loading)
  const regionOptionsLabel = regionOptions.map(({ label, value }) => ({
    label: <MenuItemLabel name={label} type='region' />,
    value,
  }))

  const streamSelectedIdx = findIndex(streamsToCreate, stream => {
    return stream.id === id
  })

  const streamSelectedChecked = streamSelectedIdx > -1

  const toggleStream = e => {
    if (streamSelectedChecked) {
      dispatch(removeStreamAction(id))
    } else {
      dispatch(addStreamAction(data))
    }
    dispatch(setIsSelectorDirtyAction(true))
  }

  const changeName = e => {
    dispatch(
      changeStreamNameAction({
        id,
        streamName: e.target.value,
      }),
    )
    dispatch(setIsSelectorDirtyAction(true))
  }

  const changeRegionSelection = region => {
    if (region) {
      const { label, value } = region
      setSelectedRegion(region)
      dispatch(
        changeStreamRegionAction({
          id,
          streamName: label,
          value,
        }),
      )
    }
  }

  const changeSiteSelection = siteOption => {
    if (siteOption) {
      setSelectedSite(siteOption)

      dispatch(
        changeStreamSite({
          id,
          value: siteOption.value,
        }),
      )
    }
  }

  const requestThumbnailImage = () => {
    dispatch(
      streamDiscoveryFetchThumbnailRequested({
        nodeIdentifier,
        id,
        streamUrl,
      }),
    )
  }

  const handleMouseHover = () => {
    setHovering(!hovering)
  }

  return (
    <SizeMe monitorHeight refreshRate={32}>
      {({ size }) => {
        return (
          <Card
            fullWidth
            hoverColor='blue'
            inlineStyle={{ width: 'unset', height: 420 }}
          >
            <HeaderDoubleLine
              inlineStyle={{ height: 72 }}
              title={
                <TextField
                  defaultValue={initName}
                  onChange={changeName}
                  disabled={!streamSelectedChecked}
                />
              }
              description={ip}
              topRight={
                <Tooltip
                  content={streamSelectedChecked ? 'Selected' : 'Select Stream'}
                  placement='bottom-end'
                >
                  <Checkbox
                    icon={
                      <Icon
                        icon='checkCircle'
                        color={theme.palette.grey[300]}
                      />
                    }
                    checkedIcon={
                      <Icon
                        icon='checkCircle'
                        color={theme.palette.primary.main}
                      />
                    }
                    onChange={toggleStream}
                    checked={streamSelectedChecked}
                  />
                </Tooltip>
              }
              bottomRight={headerBottomRight}
            />
            <Content
              inlineStyle={{
                background: 'black',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                onMouseEnter={handleMouseHover}
                onMouseLeave={handleMouseHover}
              >
                <Thumbnail
                  src={thumbnailUrl}
                  height={size.height - 200}
                  hovering={hovering}
                />
                {hovering && (
                  <div
                    onClick={requestThumbnailImage}
                    className={classes.hoveringBtn}
                  >
                    {isLoading ? (
                      <CircularProgress />
                    ) : (
                      <RefreshIcon stroke={theme.palette.common.white} />
                    )}
                  </div>
                )}
              </div>
            </Content>
            <FooterSingleLine
              height='fit-content'
              inlineStyle={{
                marginLeft: -12,
                padding: 0,
              }}
            >
              {streamSelectedChecked ? (
                <>
                  <DropdownMenu
                    menuItems={siteOptionsLabel}
                    selectedItem={find(siteOptionsLabel, {
                      value: get(selectedSite, 'value'),
                    })}
                    handleSelection={changeSiteSelection}
                    styles={{ padding: '2px 16px' }}
                  />
                  <DropdownMenu
                    menuItems={regionOptionsLabel}
                    selectedItem={regionOptionsLabel.find(
                      item => item.value === selectedRegion.value,
                    )}
                    handleSelection={changeRegionSelection}
                    styles={{ padding: '2px 16px' }}
                  />
                </>
              ) : (
                <div className={clsx('am-subtitle2', classes.notSelected)}>
                  Stream not selected
                </div>
              )}
            </FooterSingleLine>
          </Card>
        )
      }}
    </SizeMe>
  )
}

StreamInformationCard.defaultProps = {
  headerBottomRight: null,
  data: null,
}

StreamInformationCard.propTypes = {
  headerBottomRight: PropTypes.node,
  data: PropTypes.object,
}

export default StreamInformationCard
