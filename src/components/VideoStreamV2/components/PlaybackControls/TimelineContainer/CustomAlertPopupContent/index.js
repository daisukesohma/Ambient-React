/*
 * author: rodaan@ambient.ai / eric
 * DispatchMenuComponent to allow users to create arbitrary AlertEvents when they want to
 */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import { Button, TextInput } from 'ambient_ui'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import moment from 'moment'

const useStyles = makeStyles({
  card: {
    minWidth: 250,
  },
  cardContent: {
    textAlign: 'left',
  },
})

const CustomAlertPopupContent = ({
  createDispatchRequest,
  creatingDispatchRequest,
  toggleDispatchMenu,
  videoStreamTS,
}) => {
  const { palette } = useTheme()
  const classes = useStyles()
  const [title, setTitle] = useState('')

  const styles = {
    actions: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    text: {
      fontSize: 16,
      fontWeight: 'normal',
      letterSpacing: 0.5,
      color: palette.grey[500],
      lineHeight: '24px',
    },
    title: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: '20px',
      letterSpacing: 0.15,
      color: palette.common.black,
    },
  }

  const resetTitle = () => {
    setTitle('')
  }
  const handleValueChange = text => {
    setTitle(text)
  }

  const handleDispatchRequest = () => {
    createDispatchRequest(title, videoStreamTS * 1000, () => {
      resetTitle()
    })
  }

  const readableTS = moment.unix(videoStreamTS).format('M/D/YYYY HH:mm:ss')

  // https://github.com/moment/moment/issues/537
  // solves flickering issue with just a few seconds ago and a few seconds from now
  moment.fn.fromNowOrNow = function(a) {
    if (Math.abs(moment().diff(this)) < 3000) {
      // 3 seconds before or after now
      return 'just now'
    }
    return this.fromNow(a)
  }

  const relativeTime = moment.unix(videoStreamTS).fromNowOrNow()
  const buttonText = creatingDispatchRequest ? 'Creating' : 'Create'

  const createAlert = () => {
    handleDispatchRequest()
    resetTitle()
    toggleDispatchMenu()
  }

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <div style={styles.title}>Create Alert</div>
        <div style={styles.title}>@{readableTS}</div>
        <div style={styles.title}>{relativeTime}</div>
        <TextInput
          placeholder='What is being alerted?'
          helperText='We will immediately create this alert'
          onChange={handleValueChange}
        />
      </CardContent>
      <CardActions>
        <div style={styles.actions}>
          <Button onClick={toggleDispatchMenu} variant='text' color='primary'>
            Cancel
          </Button>
          <Button
            variant='text'
            color='primary'
            disabled={creatingDispatchRequest}
            onClick={createAlert}
          >
            {buttonText}
          </Button>
        </div>
      </CardActions>
    </Card>
  )
}

CustomAlertPopupContent.defaultProps = {
  videoStreamTS: null,
  createDispatchRequest: () => {},
  creatingDispatchRequest: false,
  toggleDispatchMenu: () => {},
}

CustomAlertPopupContent.propTypes = {
  videoStreamTS: PropTypes.number,
  createDispatchRequest: PropTypes.func,
  creatingDispatchRequest: PropTypes.bool,
  toggleDispatchMenu: PropTypes.func,
}

export default CustomAlertPopupContent
