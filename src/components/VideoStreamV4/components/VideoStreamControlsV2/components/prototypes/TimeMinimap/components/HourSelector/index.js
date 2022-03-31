import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'

import useStyles from './styles'

export default function HourSelector() {
  const { palette } = useTheme()
  const classes = useStyles()
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div style={{ height: 80 }}>
      <div
        id='minimap-filmstrip'
        className={classes.hours}
        style={{ display: 'flex', flexDirection: 'row', height: 32 }}
      >
        {hours.map(h => (
          <div
            key={h}
            className={clsx('am-subtitle2')}
            style={{
              width: '4.16667vw',
              border: `.25px solid ${palette.grey[900]}`,
              boxSizing: 'border-box',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: palette.grey[400],
            }}
          >
            {`${h}`}
          </div>
        ))}
      </div>
    </div>
  )
}
