import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import Tooltip from '../../../../../../../../components/Tooltip'
import StatusContent from '../../StatusContent'

import useStyles from './styles'

const propTypes = {
  createDate: PropTypes.string,
  tsIdentifierStart: PropTypes.string,
  tsIdentifierEnd: PropTypes.string,
  sourceType: PropTypes.string,
  source: PropTypes.string,
  streamId: PropTypes.string,
  id: PropTypes.number,
  videoStatus: PropTypes.object,
  metadataStatus: PropTypes.object,
  isMini: PropTypes.bool,
  AlertIcon: PropTypes.node,
}

const defaultProps = {
  createDate: '',
  tsIdentifierStart: '',
  tsIdentifierEnd: '',
  sourceType: '',
  source: '',
  streamId: '',
  id: 0,
  videoStatus: '',
  metadataStatus: '',
  isMini: false,
  AlertIcon: null,
}

function CardInfo({
  createDate,
  tsIdentifierStart,
  tsIdentifierEnd,
  sourceType,
  source,
  streamId,
  id,
  isMini,
  videoStatus,
  metadataStatus,
  AlertIcon,
}) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ isMini })
  return (
    <Tooltip
      content={
        <StatusContent
          createDate={createDate}
          tsIdentifierStart={tsIdentifierStart}
          tsIdentifierEnd={tsIdentifierEnd}
          sourceType={sourceType}
          source={source}
          streamId={streamId}
          id={id}
          videoStatus={videoStatus}
          metadataStatus={metadataStatus}
        />
      }
      theme={darkMode ? 'ambient-dark' : 'ambient-white'}
      placement={'right'}
      arrow={true}
      interactive={true}
      appendTo={document.body}
    >
      <div className={classes.info}>
        <AlertIcon
          width={isMini ? 18 : 28}
          height={isMini ? 18 : 28}
          stroke={'white'}
          fill={'white'}
        />
      </div>
    </Tooltip>
  )
}

CardInfo.propTypes = propTypes
CardInfo.defaultProps = defaultProps

export default CardInfo
