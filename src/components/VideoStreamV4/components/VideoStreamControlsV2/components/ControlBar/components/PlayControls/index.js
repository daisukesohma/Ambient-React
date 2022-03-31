import React, { memo } from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import { useTheme } from '@material-ui/core/styles'
import { Icon as IconKit } from 'react-icons-kit'
import { paus } from 'react-icons-kit/entypo/paus'
import { thinRight } from 'react-icons-kit/entypo/thinRight'
import { thinLeft } from 'react-icons-kit/entypo/thinLeft'
import clsx from 'clsx'
import { arrowLeft } from 'react-icons-kit/feather/arrowLeft'
import { arrowRight } from 'react-icons-kit/feather/arrowRight'
import useMediaQuery from '@material-ui/core/useMediaQuery'

// src
import { Icon } from 'ambient_ui'
import { useCursorStyles, useFlexStyles } from 'common/styles/commonStyles'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'

import KeyShortcutDisplay from '../KeyShortcutDisplay'

import useStyles from './styles'

const propTypes = {
  accountSlug: PropTypes.string,
  handleNextFrame: PropTypes.func,
  handlePreviousFrame: PropTypes.func,
  isPlaying: PropTypes.bool,
  playerMoveSeconds: PropTypes.func,
  playerPlayPause: PropTypes.func,
}

function PlayControls({
  accountSlug,
  handleNextFrame,
  handlePreviousFrame,
  isPlaying,
  playerMoveSeconds,
  playerPlayPause,
}) {
  const { palette } = useTheme()
  const classes = useStyles({ isPlaying })
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const fadeIn = !isPlaying

  return (
    <>
      {useMediaQuery('(min-width:1400px)') && (
        <div
          className={clsx(cursorClasses.pointer, classes.playButton)}
          onClick={() => playerMoveSeconds(-10)}
        >
          <Tooltip
            content={
              <div className={flexClasses.row}>
                <TooltipText>Back 10</TooltipText>
                <KeyShortcutDisplay>
                  <IconKit icon={arrowLeft} size={12} />
                </KeyShortcutDisplay>
              </div>
            }
          >
            <span>
              <IconButton color='primary' size='small'>
                <Icon
                  icon='back'
                  fillOnlyIcon='back10'
                  color={palette.primary[500]}
                  size={24}
                />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      )}
      <div
        className={clsx(
          classes.invisible,
          classes.frameButtons,
          { fadeIn },
          cursorClasses.pointer,
        )}
      >
        <Tooltip
          content={<TooltipText>Frame Back</TooltipText>}
          disabled={isPlaying}
        >
          <div>
            <IconButton
              color='primary'
              size='small'
              onClick={handlePreviousFrame}
            >
              <IconKit icon={thinLeft} size={18} />
            </IconButton>
          </div>
        </Tooltip>
      </div>

      <div
        className={clsx(cursorClasses.pointer, classes.playButton)}
        onClick={playerPlayPause}
      >
        <Tooltip
          content={
            <div className={flexClasses.row}>
              <TooltipText>{isPlaying ? 'Pause' : 'Play'}</TooltipText>
              <KeyShortcutDisplay keyName='Space' />
            </div>
          }
        >
          <span id='play-button'>
            <IconButton color='primary' size='small'>
              {isPlaying ? (
                <IconKit icon={paus} size={32} />
              ) : (
                <span style={{ marginLeft: 4 }}>
                  <Icon icon='play' color={palette.primary[500]} size={32} />
                </span>
              )}
            </IconButton>
          </span>
        </Tooltip>
      </div>
      <div
        className={clsx(
          classes.invisible,
          classes.frameButtons,
          { fadeIn },
          cursorClasses.pointer,
        )}
        onClick={handleNextFrame}
      >
        <Tooltip
          content={<TooltipText>Frame Fwd</TooltipText>}
          disabled={isPlaying}
        >
          <span>
            <IconButton color='primary' size='small'>
              <IconKit icon={thinRight} size={18} />
            </IconButton>
          </span>
        </Tooltip>
      </div>
      {useMediaQuery('(min-width:1400px)') && (
        <div
          className={clsx(cursorClasses.pointer, classes.playButton)}
          onClick={() => playerMoveSeconds(10)}
        >
          <Tooltip
            content={
              <div className={flexClasses.row}>
                <TooltipText>Fwd 10</TooltipText>
                <KeyShortcutDisplay>
                  <IconKit icon={arrowRight} size={12} />
                </KeyShortcutDisplay>
              </div>
            }
          >
            <span>
              <IconButton color='primary' size='small'>
                <Icon
                  icon='forward'
                  fillOnlyIcon='forward10'
                  color={palette.primary[500]}
                  size={24}
                />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      )}
    </>
  )
}

PlayControls.propTypes = propTypes

export default memo(PlayControls)
