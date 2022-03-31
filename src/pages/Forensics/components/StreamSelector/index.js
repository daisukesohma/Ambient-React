import React, { useState, useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { get, isEmpty, map } from 'lodash'
import { Divider, Box } from '@material-ui/core'
import { useSelector, useDispatch, batch } from 'react-redux'
import clsx from 'clsx'
import { CircularProgress, SearchBar } from 'ambient_ui'
import {
  setActiveStream,
  setStreamQuery,
  setHoveredStream,
} from 'redux/forensics/actions'
import { useCursorStyles, useFlexStyles } from 'common/styles/commonStyles'
import getRegionStreamsFromStreamNodes from 'selectors/forensics/getRegionStreamsFromStreamNodes'

import useStyles from './styles'

export default function RegionStreamSelector() {
  const { palette } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)
  const [visibleStreams, setVisibleStreams] = useState([])
  const [isHoveredFromSelector, setIsHoveredFromSelector] = useState(false)

  const dispatch = useDispatch()
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const selectedRegion = useSelector(state => state.forensics.selectedRegion)
  const selectedRegionId = get(selectedRegion, 'id')
  const activeStream = useSelector(state => state.forensics.activeStream)
  const streamStats = useSelector(state => state.forensics.streamStats)
  const streamNodes = useSelector(getRegionStreamsFromStreamNodes)
  const streamQuery = useSelector(state => state.forensics.streamQuery)
  const streamIdHovered = useSelector(state => state.forensics.streamIdHovered)

  const classes = useStyles({ isExpanded })

  // hovered from graph and not hovered from selector
  const isHoveredFromGraph = streamIdHovered && !isHoveredFromSelector

  // This attempts to solve a readability problem on the Stream Graph
  // On hover, it only shows ONE stream in the selector, and highlights it to allow
  // for reading of the entire name.
  //
  //  There are two issues with this.
  //  1) It is not immediately apparent to look below the graph in order to read the full name
  // 2) this creates a UI flickering that may not be desirable
  //
  // Finally, the graph has been improved for reading the full name, so this may become obsolete
  // as a visual solution.
  //
  useEffect(() => {
    if (!visibleStreams) {
      // set visible streams to be all stream nodes as default, the first time.
      setVisibleStreams(streamNodes)
    } else if (visibleStreams && isHoveredFromGraph) {
      // if hovering on stream on the graph (svg), ONLY show the one that's hovered
      setVisibleStreams(streamNodes.filter(s => s.id === streamIdHovered))
    } else {
      // else show all streams
      setVisibleStreams(streamNodes)
    }
  }, [streamIdHovered, streamNodes, isHoveredFromGraph]) // eslint-disable-line

  if (selectedRegion === null) {
    return null
  }

  const resetSelection = () => {
    batch(() => {
      dispatch(setActiveStream({ regionId: selectedRegionId, streamId: null }))
    })
  }

  const selectStream = stream => {
    dispatch(
      setActiveStream({
        regionId: selectedRegionId,
        streamId: stream.id,
      }),
    )
  }

  const handleChange = val => {
    dispatch(setStreamQuery(val))
  }

  const handleSelect = stream => {
    if (stream.hasResults && activeStream !== stream.id) {
      selectStream(stream)
    } else {
      resetSelection()
    }
  }

  return (
    <div
      className={classes.root}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Box className={clsx(flexClasses.row, flexClasses.centerStart)} mb={2}>
        <div>{selectedRegion.name}</div>
        <Box ml={3}>
          <SearchBar
            darkMode
            isClearShown={streamQuery}
            onChange={handleChange}
            InputProps={{
              placeholder: 'Filter streams...',
            }}
          />
        </Box>
        <Box ml={2}>
          <span
            className={clsx(
              'am-overline',
              cursorClasses.pointer,
              cursorClasses.clickableText,
            )}
            onClick={resetSelection}
          >
            Reset
          </span>
        </Box>
      </Box>
      <Divider />
      <div className={classes.streamsWrapper}>
        {!isEmpty(streamStats) ? (
          map(visibleStreams, stream => {
            let styles = {
              // color: palette.grey[500],
              // background: palette.common.black,
              border: `2px solid ${palette.text.primary}`,
            }

            if (stream.hasResults) {
              styles = {
                ...styles,
                cursor: 'pointer',
              }
            }

            if (streamIdHovered === stream.id) {
              styles = {
                ...styles,
                color: palette.primary.main,
                // border: `2px solid ${palette.primary[500]}`,
              }
            }

            if (activeStream === stream.id) {
              styles = {
                ...styles,
                color: palette.text.primary,
                background: palette.primary.main,
              }
            }

            return (
              <>
                <div
                  key={`${stream.id}`}
                  className={clsx('am-subtitle2', classes.streamChip)}
                  onClick={() => handleSelect(stream)}
                  onMouseEnter={() => {
                    setIsHoveredFromSelector(true)
                    dispatch(setHoveredStream(stream.id))
                  }}
                  onMouseLeave={() => {
                    setIsHoveredFromSelector(false)
                    dispatch(setHoveredStream(null))
                  }}
                  style={styles}
                >
                  {stream.name}
                </div>
                {isHoveredFromGraph && (
                  <div
                    style={{ color: palette.primary.main, height: '100%' }}
                    className={clsx(
                      flexClasses.row,
                      flexClasses.centerStart,
                      'am-caption',
                    )}
                  >
                    {streamIdHovered && !activeStream
                      ? 'Click to Filter'
                      : null}
                    {streamIdHovered && activeStream === streamIdHovered
                      ? 'Filtered!'
                      : null}
                  </div>
                )}
              </>
            )
          })
        ) : (
          <Box m={0.5} mt={1}>
            <CircularProgress />
          </Box>
        )}
      </div>
    </div>
  )
}
