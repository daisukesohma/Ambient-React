import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { Grid, Box } from '@material-ui/core'
import clsx from 'clsx'
import { Icon as IconKit } from 'react-icons-kit'
import { eraser } from 'react-icons-kit/fa/eraser'
import { paintbrush } from 'react-icons-kit/ionicons/paintbrush'
import { handPaperO } from 'react-icons-kit/fa/handPaperO'
import { get } from 'lodash'
// src
import { Icons } from 'ambient_ui'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import PageTitle from 'components/Page/Title'
import ConfirmDialog from 'components/ConfirmDialog'
import { useCursorStyles } from 'common/styles/commonStyles'
import {
  setTool,
  setBrushSize,
  updateStreamRequested,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import { PAINTING_TOOLS } from 'features/StreamConfiguration/constants'
import buildBitMap from 'features/StreamConfiguration/utils/buildBitMap'

import makeStyles from './styles'

export default function PaintTools() {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const tool = useSelector(state => state.streamConfiguration.tool)
  const brushSize = useSelector(state => state.streamConfiguration.brushSize)
  const activeZone = useSelector(state => state.streamConfiguration.activeZone)
  const classes = makeStyles()
  const cursorClasses = useCursorStyles()

  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const streamUpdateLoading = useSelector(
    state => state.streamConfiguration.streamUpdateLoading,
  )

  const handleSelection = selectedTool => {
    dispatch(setTool({ tool: selectedTool }))
  }

  const changeBrushSize = size => {
    dispatch(setBrushSize({ brushSize: size }))
  }

  const brushSizes = [1, 2, 4, 8, 20, 36, 64]

  const eraseStream = () => {
    const bitMap = buildBitMap({ erased: true })
    dispatch(
      updateStreamRequested({
        id: activeStream.id,
        bitMap,
        afterUpdate: () => setShowConfirmDialog(false),
      }),
    )
  }

  const getDisplayBrushColor = () => {
    if (tool === PAINTING_TOOLS.PEN) {
      return get(activeZone, 'color', palette.grey[700])
    }
    // ERASER as default
    return palette.grey[300]
  }
  return (
    <>
      <Grid container alignContent='center'>
        <Box mt={1} mb={1} ml={1}>
          <PageTitle title='Painting Tools' sizeClass='am-h5' />
        </Box>
      </Grid>
      <Grid container alignContent='center'>
        <Box
          m={1}
          className={cursorClasses.pointer}
          onClick={() => handleSelection(null)}
        >
          <Tooltip content={<TooltipText>Pan </TooltipText>}>
            <span
              style={{
                color: !tool ? palette.primary.main : palette.text.primary,
              }}
            >
              <IconKit icon={handPaperO} size={22} />
            </span>
          </Tooltip>
        </Box>
        {activeZone && (
          <>
            <Box
              m={1}
              className={cursorClasses.pointer}
              onClick={() => handleSelection(PAINTING_TOOLS.PEN)}
            >
              <Tooltip content={<TooltipText>Brush</TooltipText>}>
                <span
                  style={{
                    color:
                      tool === PAINTING_TOOLS.PEN
                        ? palette.primary.main
                        : palette.text.primary,
                  }}
                >
                  <IconKit icon={paintbrush} size={22} />
                </span>
              </Tooltip>
            </Box>
          </>
        )}
        <Box
          m={1}
          className={cursorClasses.pointer}
          onClick={() => handleSelection(PAINTING_TOOLS.ERASER)}
        >
          <Tooltip
            content={<TooltipText>Eraser</TooltipText>}
            placement='bottom'
          >
            <span
              style={{
                color:
                  tool === PAINTING_TOOLS.ERASER
                    ? palette.primary.main
                    : palette.text.primary,
              }}
            >
              <IconKit icon={eraser} size={22} />
            </span>
          </Tooltip>
        </Box>
        <Box
          m={1}
          onClick={() => setShowConfirmDialog(true)}
          className={cursorClasses.pointer}
        >
          <Tooltip content='Erase Stream'>
            <Icons.Trash width={24} height={24} />
          </Tooltip>
        </Box>

        <ConfirmDialog
          open={showConfirmDialog}
          onConfirm={eraseStream}
          onClose={() => setShowConfirmDialog(false)}
          loading={streamUpdateLoading}
          content='Are you sure that you clear all painting on the stream?'
        />
      </Grid>
      {(tool === PAINTING_TOOLS.PEN || tool === PAINTING_TOOLS.ERASER) && (
        <Grid container alignContent='flex-start'>
          <Grid item xs={6}>
            <Box ml={1} mt={2} mb={2}>
              <div className={clsx('am-caption', cursorClasses.pointer)}>
                {tool === PAINTING_TOOLS.PEN && 'Brush Size'}
                {tool === PAINTING_TOOLS.ERASER && 'Eraser Size'}
              </div>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box mr={2} mb={2} className={classes.brushContainer}>
              {brushSizes.map(size => (
                <div
                  key={`brushSize-${size}`}
                  onClick={() => changeBrushSize(size)}
                  className={clsx(
                    cursorClasses.pointer,
                    classes.individualBrushSizeContainer,
                    { [classes.brushSelected]: size === brushSize },
                  )}
                >
                  <div
                    className={clsx(classes.brush)}
                    style={{
                      width: size,
                      height: size,
                      background: getDisplayBrushColor(),
                    }}
                  />
                  <div className='am-caption'>
                    {size}
                    px
                  </div>
                </div>
              ))}
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  )
}
