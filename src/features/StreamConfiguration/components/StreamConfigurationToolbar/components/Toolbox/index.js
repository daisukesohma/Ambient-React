import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { Box } from '@material-ui/core'
// src
import { Icon } from 'ambient_ui'
import Tooltip from 'components/Tooltip'
import { setMode } from 'features/StreamConfiguration/streamConfigurationSlice'
import { useCursorStyles } from 'common/styles/commonStyles'
import { STREAM_CONFIGURATION_MODES } from 'features/StreamConfiguration/constants'

export default function Toolbox() {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const mode = useSelector(state => state.streamConfiguration.mode)
  const cursorClasses = useCursorStyles()

  const handleSelection = selectedMode => {
    if (mode !== selectedMode) {
      // ensures tool doesn't reset state if user is already on it
      dispatch(setMode({ mode: selectedMode }))
    }
  }
  return (
    <Box display='flex' flexDirection='row'>
      <Box
        m={1}
        className={cursorClasses.pointer}
        onClick={() => handleSelection(STREAM_CONFIGURATION_MODES.DEFAULT)}
      >
        <Tooltip content='Layers'>
          <Icon
            icon={'mousePointer'}
            fill={
              mode === STREAM_CONFIGURATION_MODES.DEFAULT
                ? palette.common.greenPastel
                : palette.text.primary
            }
            stroke={
              mode === STREAM_CONFIGURATION_MODES.DEFAULT
                ? palette.primary.main
                : palette.text.primary
            }
            size={22}
          />
        </Tooltip>
      </Box>
      <Box
        m={1}
        className={cursorClasses.pointer}
        onClick={() => handleSelection(STREAM_CONFIGURATION_MODES.ZONES)}
      >
        <Tooltip content='Zone Painter'>
          <Icon
            viewBox='0 0 100 100'
            icon='mosaic'
            fill={
              mode === STREAM_CONFIGURATION_MODES.ZONES
                ? palette.common.greenPastel
                : palette.grey[500]
            }
            stroke={
              mode === STREAM_CONFIGURATION_MODES.ZONES
                ? palette.primary.main
                : palette.text.primary
            }
            size={22}
          />
        </Tooltip>
      </Box>
      <Box
        m={0.5}
        className={cursorClasses.pointer}
        onClick={() => handleSelection(STREAM_CONFIGURATION_MODES.BOUNDING_BOX)}
      >
        <Tooltip content='Bounding Box'>
          <Icon
            viewBox='0 0 100 100'
            icon='boundingBox'
            color={
              mode === STREAM_CONFIGURATION_MODES.BOUNDING_BOX
                ? palette.common.greenPastel
                : palette.text.primary
            }
            size={30}
          />
        </Tooltip>
      </Box>
      <Box
        m={0.75}
        className={cursorClasses.pointer}
        onClick={() =>
          handleSelection(STREAM_CONFIGURATION_MODES.POINT_ANNOTATION)
        }
      >
        <Tooltip content='4 Point Annotation'>
          <Icon
            viewBox='0 0 48 48'
            icon='fourPoint'
            color={
              mode === STREAM_CONFIGURATION_MODES.POINT_ANNOTATION
                ? palette.common.greenPastel
                : palette.text.primary
            }
            size={26}
          />
        </Tooltip>
      </Box>
    </Box>
  )
}
