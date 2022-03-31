import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
// src
import Tooltip from 'components/Tooltip'
import {
  NodeRequestStatusEnum,
  NodeRequestTypeEnum,
  NodeRequestTypeToReadableEnum,
} from 'enums'
import { useFlexStyles, useCursorStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

const getIPAddress = requestData => {
  try {
    return JSON.parse(requestData)
      .streams[0].url.split('@')[1]
      .split('/')[0]
  } catch (err) {
    return ''
  }
}

export default function DescriptionField({
  requestType,
  summary,
  request,
  status,
  statusText,
}) {
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const job = NodeRequestTypeToReadableEnum[requestType]

  // for Stream Request jobs
  const getDescription = (summaryData, requestData) => {
    if (requestType === NodeRequestTypeEnum.DISCOVERY) {
      if (summary && status === NodeRequestStatusEnum.COMPLETED) {
        const totalSuccess = summaryData.successful.length
        const totalFailed = summaryData.failed.length
        const totalCompleted = totalSuccess + totalFailed
        const parsedRequest = JSON.parse(requestData)
        const discoveryType =
          parsedRequest &&
          parsedRequest.endpoints &&
          parsedRequest.endpoints.length === 0
            ? 'Automatic Scan'
            : 'Manual Discovery'

        // offset={'[8, 0]'}
        return (
          <Tooltip
            placement='right'
            arrow
            content={
              <div
                className={clsx(
                  flexClasses.column,
                  flexClasses.columnCenterStart,
                  classes.tooltipRoot,
                )}
              >
                <div className={clsx('am-caption', classes.tooltipText)}>
                  {totalSuccess} cameras discovered
                </div>
                <div className={clsx('am-caption', classes.tooltipText)}>
                  {totalFailed} cameras not found
                </div>
                <div className={clsx('am-caption', classes.tooltipText)}>
                  {totalCompleted} total attempted
                </div>
                <div className={clsx('am-caption', classes.tooltipText)}>
                  Type: {discoveryType}
                </div>
              </div>
            }
          >
            <span
              className={clsx(
                'am-subtitle2',
                cursorClasses.pointer,
                classes.baseText,
              )}
            >
              {totalSuccess} cameras discovered
            </span>
          </Tooltip>
        )
      }

      return (
        <span className={clsx('am-subtitle2', classes.baseText)}>
          {job} {statusText}
        </span>
      )
    }

    if (requestType === NodeRequestTypeEnum.CAPTURE_FRAME) {
      const ip = getIPAddress(requestData)
      const ipStr = ip ? ` of Stream on ${ip}` : ''
      return (
        <span className={clsx('am-subtitle2', classes.baseText)}>
          {`${job}${ipStr}`}
        </span>
      )
    }

    return <span className={clsx('am-subtitle2', classes.baseText)}>{job}</span>
  }

  return (
    <div className={clsx('am-subtitle2', classes.baseText)}>
      <span className={clsx('am-subtitle2', classes.emphasized)}>
        {getDescription(summary, request)}
      </span>
    </div>
  )
}

DescriptionField.defaultProps = {
  requestType: '',
  summary: {},
  request: '', // json string
  status: '',
  statusText: '',
}

DescriptionField.propTypes = {
  requestType: PropTypes.string,
  summary: PropTypes.object,
  request: PropTypes.string,
  status: PropTypes.string,
  statusText: PropTypes.string,
}
