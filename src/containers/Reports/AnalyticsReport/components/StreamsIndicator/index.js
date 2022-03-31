import React, { useCallback } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import get from 'lodash/get'
import find from 'lodash/find'
import some from 'lodash/some'
import map from 'lodash/map'
import filter from 'lodash/filter'
// src
import { SmartFilter } from 'ambient_ui'
import { setStreams } from 'redux/slices/analytics'
import propTypes from '../../propTypes/metric'

import useStyles from './styles'

const fuseSearchOptions = {
  keys: ['name', 'region.name'],
}

function StreamsIndicator({ metric }) {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const classes = useStyles({ darkMode: false })
  const streams = metric.streams

  const isActiveStream = useCallback(
    stream => some(metric.streams, { id: stream.id }),
    [metric.streams],
  )

  const selectStreams = selected => {
    dispatch(
      setStreams({
        metric,
        streams: map(selected, ({ value }) => find(streams, { id: value })),
      }),
    )
  }

  return (
    <div className={classes.filterWrapper}>
      <SmartFilter
        label='Streams'
        prefixLabel={`${get(metric, 'site.name')}: `}
        isTotalVisible
        options={map(streams, ({ id, name }) => ({ value: id, label: name }))}
        initialSelected={filter(streams, stream => isActiveStream(stream)).map(
          ({ id, name }) => ({ value: id, label: name }),
        )}
        onApply={selectStreams}
        customBackground={palette.grey[50]}
        fuseSearch={{
          options: fuseSearchOptions,
          objects: streams,
          labelKey: 'name',
          valueKey: 'id',
        }}
      />
    </div>
  )
}

StreamsIndicator.propTypes = propTypes

export default StreamsIndicator
