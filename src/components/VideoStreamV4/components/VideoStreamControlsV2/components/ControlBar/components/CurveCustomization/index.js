import React, { useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
// src
import { Icons } from 'ambient_ui'
import CircularIconButton from 'components/Buttons/CircularIconButton'
import { toggleMetadataCurveVisible } from 'redux/slices/videoStreamControls'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import { useFuturisticStyles, useFlexStyles } from 'common/styles/commonStyles'

import CurveInstancePlayer from '../CurveInstancePlayer'
import { queryEntityWithRange } from '../../../../utils'
import { CURVE_ICONS } from '../../../../constants'

import useStyles from './styles'

const propTypes = {
  videoStreamKey: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  getMetadata: PropTypes.func,
}

function CurveCustomization({ isOpen, getMetadata, videoStreamKey }) {
  const { palette } = useTheme()
  const classes = useStyles()
  const dispatch = useDispatch()
  const flexClasses = useFlexStyles()
  const futuristicClasses = useFuturisticStyles()

  // returns an object of { [key]: true/false }
  // where key is the entity camel cased: 'person', 'car', 'personCarryingBox'
  // if true, show the curve. if false, hide it.
  //
  const metadataCurveVisible = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'metadataCurveVisible',
    }),
  )

  const getCurveVisible = key => {
    if (metadataCurveVisible) {
      return metadataCurveVisible[key]
    }
    return false
  }

  const timeRange = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'timeRange',
    }),
  )

  // This will requery whenever timeRange changes in redux.
  // This is currently on a ten second interval inside VideoStreamControlsV2
  useEffect(() => {
    if (metadataCurveVisible && timeRange) {
      Object.keys(metadataCurveVisible).forEach(key => {
        if (metadataCurveVisible[key]) {
          queryEntityWithRange(
            CURVE_ICONS.find(i => i.key === key).query,
            timeRange,
            getMetadata,
          )
        }
      })
    }
  }, [timeRange]) // eslint-disable-line

  if (!isOpen) return false

  return (
    <div id='curveCustomization' className={classes.root}>
      <div className={classes.backgroundContainer}>
        <div
          className={clsx(
            futuristicClasses.iceSheet,
            flexClasses.column,
            flexClasses.centerAll,
            classes.buttonContainer,
          )}
        >
          {CURVE_ICONS.map(icon => {
            const IconComponent = Icons[icon.iconKey]
            const isOn = getCurveVisible(icon.key)
            const handleIconSelect = () => {
              dispatch(
                toggleMetadataCurveVisible({
                  videoStreamKey,
                  metadataKey: icon.key,
                  visible: !isOn,
                }),
              )
              queryEntityWithRange(icon.query, timeRange, getMetadata)
            }

            return (
              <div
                key={`iconContainer-${icon.key}`}
                className={clsx(flexClasses.row, flexClasses.centerStart)}
                style={{ width: '100%' }}
              >
                <div
                  id={`motion-icon-${icon.key}`}
                  className={clsx(flexClasses.row, flexClasses.centerStart)}
                  style={{ width: '100%', marginTop: 4, marginBottom: 4 }}
                  onClick={handleIconSelect}
                >
                  <div>
                    <CircularIconButton
                      borderVisible={isOn}
                      borderWidth={1}
                      iconNode={
                        <IconComponent
                          stroke={isOn ? icon.activeColor : palette.grey[300]}
                          size={20}
                          width={18}
                          height={18}
                        />
                      }
                      tooltipContent={`${isOn ? 'Hide' : 'Show'}  ${
                        icon.iconKey
                      } Motion`}
                      tooltipProps={{
                        placement: 'left',
                      }}
                    />
                    <div
                      className={classes.selectedBar}
                      style={{
                        background: isOn ? icon.activeColor : 'transparent',
                      }}
                    />
                  </div>
                </div>
                <div id='instance-player' style={{ marginLeft: 8 }}>
                  {isOn && (
                    <CurveInstancePlayer
                      videoStreamKey={videoStreamKey}
                      metadataKey={icon.key}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

CurveCustomization.propTypes = propTypes

export default memo(CurveCustomization)
