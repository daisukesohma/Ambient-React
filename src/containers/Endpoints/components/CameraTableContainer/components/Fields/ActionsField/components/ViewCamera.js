import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { ModalTypeEnum } from 'enums'
import { useDispatch, useSelector } from 'react-redux'
import get from 'lodash/get'
// src
import { Icon } from 'ambient_ui'
import Tooltip from 'components/Tooltip'
import { showModal } from 'redux/slices/modal'
import { useCursorStyles } from 'common/styles/commonStyles'

const propTypes = {
  rowData: PropTypes.object,
}

function ViewCamera({ rowData }) {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  const { streamName, streamId, node, siteSlug } = rowData
  const dispatch = useDispatch()
  const cursorClasses = useCursorStyles()

  const handleOpenModal = data => {
    dispatch(showModal(data))
  }

  // close any modals that might be open
  // show the feed modal
  // eslint-disable-next-line
  const onExpandFeed = (streamName, streamId, nodeId, siteSlug, timezone) => {
    const data = {
      content: {
        streamName,
        streamId,
        nodeId,
        siteSlug,
        timezone,
      },
      type: ModalTypeEnum.VIDEO,
    }

    handleOpenModal(data)
  }

  const handleClick = () => {
    onExpandFeed(
      streamName,
      streamId,
      get(node, 'identifier'),
      siteSlug,
      get(node, 'site.timezone'),
    )
  }

  return (
    <Tooltip content='View Camera'>
      <Icon
        icon='eye'
        color={darkMode ? palette.primary[300] : palette.primary.main}
        onClick={handleClick}
        className={cursorClasses.pointer}
      />
    </Tooltip>
  )
}

ViewCamera.propTypes = propTypes

export default ViewCamera
