import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles(({ palette }) => ({
  root: {
    boxShadow: `-1px 0px 9px 0px ${palette.grey[700]}`,
    borderRadius: 20,
    width: 'fit-content',
    padding: '0 16px',
  },
  text: {
    marginLeft: 8,
    marginRight: 8,
  },
}))

const Chip = ({ imgSrc, primary, secondary }) => {
  const classes = useStyles()

  return (
    <ListItem className={classes.root}>
      {imgSrc && <Avatar src={imgSrc} />}
      <ListItemText
        primary={primary}
        secondary={secondary}
        className={classes.text}
      />
    </ListItem>
  )
}

Chip.defaultProps = {
  secondary: undefined,
  imgSrc: undefined,
}

Chip.propTypes = {
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string,
  imgSrc: PropTypes.string,
}

export default Chip
