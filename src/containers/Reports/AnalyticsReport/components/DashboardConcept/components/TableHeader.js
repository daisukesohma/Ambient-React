import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Chip from '@material-ui/core/Chip'
import ApartmentIcon from '@material-ui/icons/Apartment'
import RoomIcon from '@material-ui/icons/Room'
import PersonPinIcon from '@material-ui/icons/PersonPin'
import Box from '@material-ui/core/Box'
import first from 'lodash/first'
import last from 'lodash/last'
// src
import DateTimeRangePickerV3 from 'components/organisms/DateTimeRangePickerV3'
import { msToUnix } from 'utils'

const propTypes = {
  title: PropTypes.string,
  building: PropTypes.string,
  floor: PropTypes.string,
  live: PropTypes.number,
  onTimeChange: PropTypes.func,
  onFloorChange: PropTypes.func,
}

function TableHeader({
  title,
  building,
  floor,
  live,
  onFloorChange,
  onTimeChange,
}) {
  const [startTs, setStartTs] = useState(msToUnix(Date.now()) - 86400)
  const [endTs, setEndTs] = useState(msToUnix(Date.now()))

  return (
    <Box display='flex' flexDirection='column' mt={1}>
      <Box display='flex' flexDirection='row' alignItems='center'>
        <Box>
          <h6>{title}</h6>
        </Box>
        <Box ml={1}>
          <DateTimeRangePickerV3
            startTs={startTs}
            endTs={endTs}
            onChange={dateRange => {
              setStartTs(first(dateRange))
              setEndTs(last(dateRange))
              if (onTimeChange) {
                onTimeChange(startTs, endTs)
              }
            }}
            preSetsInLabels
          />
        </Box>
      </Box>
      <Box>
        <Box display='flex' flexDirection='row' alignItems='center'>
          {building && (
            <Box>
              <Chip
                variant='outlined'
                size='small'
                label={`Building: ${building}`}
                color='primary'
                icon={<ApartmentIcon />}
              />
            </Box>
          )}
          {floor && (
            <Box ml={0.5}>
              <Chip
                variant='outlined'
                size='small'
                label={`Floor ${floor}`}
                color='primary'
                onClick={onFloorChange}
                icon={<RoomIcon />}
              />
            </Box>
          )}
          {live && (
            <Box ml={0.5}>
              <Chip
                size='small'
                label={`Live: ${live}`}
                color='primary'
                icon={<PersonPinIcon />}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

TableHeader.propTypes = propTypes

export default TableHeader
