import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import moment from 'moment'
import { Button } from 'ambient_ui'
import { Grid } from '@material-ui/core'

import useStyles from './styles'

const VideoLength = ({ seconds }) => {
  const { palette } = useTheme()

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return (
    <span
      style={{
        color: palette.grey[700],
        fontSize: 12,
        fontWeight: '500',
        lineHeight: '20px',
        letterSpacing: 0.15,
        width: 'fit-content',
      }}
    >
      {mins > 0 && <span>{mins} mins</span>}
      {mins > 0 && secs > 0 && <span>, </span>}
      {secs > 0 && <span>{secs} secs</span>}
    </span>
  )
}

const ArchivePopupContent = ({
  exportStartTS,
  exportEndTS,
  handleExport,
  placeholder,
  toggleExportMode,
}) => {
  const { palette } = useTheme()
  const classes = useStyles()
  const start = exportStartTS && moment.unix(exportStartTS).format('HH:mm:ss')
  const end = exportEndTS && moment.unix(exportEndTS).format('HH:mm:ss')
  const [length, setLength] = useState(undefined)

  const styles = {
    placeholder: {
      fontSize: 16,
      fontWeight: 'normal',
      letterSpacing: 0.5,
      lineHeight: '24px',
      paddingBottom: '10px',
    },
    time: {
      fontSize: 10,
      fontWeight: 'normal',
      letterSpacing: 1.5,
      textAlign: 'center',
      lineHeight: '16px',
      textTransform: 'uppercase',
      color: palette.common.black,
      width: '125px',
      background: palette.grey[100],
      border: `1px solid ${palette.grey[100]}`,
      boxSizing: 'border-box',
    },
  }

  // Calculate length of video anytime it changes
  useEffect(() => {
    if (exportStartTS && exportEndTS) {
      setLength(exportEndTS - exportStartTS)
    }
  }, [exportStartTS, exportEndTS])

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <div style={styles.placeholder}>{placeholder}</div>
        {start && end && (
          <Grid
            container
            direction='row'
            justify='space-between'
            alignItems='center'
          >
            <Grid item style={styles.time}>
              {start} /{end}
            </Grid>
            <Grid item>
              <VideoLength seconds={length} />
            </Grid>
          </Grid>
        )}
      </CardContent>
      <CardActions>
        <Grid
          container
          direction='row'
          justify='space-between'
          alignItems='center'
        >
          <Grid item>
            <Button onClick={toggleExportMode} variant='text' color='primary'>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={handleExport} variant='text' color='primary'>
              Save
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  )
}

VideoLength.defaultProps = {
  seconds: undefined,
}

VideoLength.propTypes = {
  seconds: PropTypes.number,
}

ArchivePopupContent.defaultProps = {
  exportStartTS: 0,
  exportEndTS: 0,
  handleExport: () => {},
  placeholder: 'Save Clip',
  toggleExportMode: () => {},
}
ArchivePopupContent.propTypes = {
  exportStartTS: PropTypes.number,
  exportEndTS: PropTypes.number,
  handleExport: PropTypes.func,
  placeholder: PropTypes.string,
  toggleExportMode: PropTypes.func,
}
export default ArchivePopupContent
