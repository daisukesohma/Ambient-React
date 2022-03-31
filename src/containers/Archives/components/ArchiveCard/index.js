import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Grid, Box } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { animated } from 'react-spring'
import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import moment from 'moment'
import { CircularProgress, Icons } from 'ambient_ui'

import useStyles from '../../styles'

const ArchiveCard = ({ styleProps, item, siteName, handleDelete }) => {
  const { palette } = useTheme()
  const { loadingDelete, clipToDelete } = useSelector(state => state.archives)
  const darkMode = useSelector(state => state.settings.darkMode)

  const classes = useStyles({ darkMode })

  return (
    <Grid item lg={3} md={3} sm={12} xs={12} key={item.id}>
      <animated.div style={{ ...styleProps, transform: 'unset' }}>
        <Card className={classes.cardRoot} classes={{ root: classes.cardRoot }}>
          <CardHeader
            title={`${siteName} ${item.stream.name}`}
            subheader={moment(item.startTs).format('MMM DD, YYYY (HH:mm:ss)')}
            className={classes.cardFlexOne}
            classes={{ subheader: classes.cardSubheader }}
          />
          <video className={classes.media} controls>
            <source src={item.signedUrl} type='video/mp4' />
          </video>
          <CardContent className={classes.cardContent}>
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              justifyContent='space-between'
              className={classes.archiveFooter}
            >
              <Box>
                <strong>Duration : </strong>
                {moment.duration(item.endTs - item.startTs).humanize()}
              </Box>
              <Box>
                {loadingDelete && clipToDelete === item.uniq ? (
                  <CircularProgress size={18} />
                ) : (
                  <IconButton aria-label='delete' onClick={handleDelete(item)}>
                    <Icons.Trash
                      stroke={
                        darkMode ? palette.common.white : palette.common.black
                      }
                    />
                  </IconButton>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </animated.div>
    </Grid>
  )
}

export default ArchiveCard

ArchiveCard.propTypes = {
  styleProps: PropTypes.object,
  item: PropTypes.object,
  siteName: PropTypes.string,
  handleDelete: PropTypes.func,
}

ArchiveCard.defaultProps = {
  styleProps: {},
  item: {
    name: '',
    stream: { name: '' },
  },
  siteName: '',
  handleDelete: () => {},
}
