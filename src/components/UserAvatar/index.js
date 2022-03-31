import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import { useTheme } from '@material-ui/core/styles'

import useStyles from './styles'

const propTypes = {
  name: PropTypes.string.isRequired,
  img: PropTypes.string,
  size: PropTypes.number,
}

const defaultProps = {
  name: null,
  img: null,
  size: 34,
}

const UserAvatar = ({ img, name, size }) => {
  const { palette } = useTheme()
  const availableColors = [
    palette.primary.main,
    palette.primary.dark,
    palette.grey[700],
    palette.secondary.main,
    palette.secondary[900],
    palette.common.tertiary,
    palette.common.black,
    palette.warning.main,
    palette.common.greenBluePastel,
  ]

  const [bgColor, setBgColor] = useState(() => {
    if (name) {
      // sums the ascii code of the name
      const sumLetters = [...name].reduce(
        (sum, char) => sum + char.charCodeAt(0),
        0,
      )
      return availableColors[sumLetters % availableColors.length]
    }
    return palette.grey[700]
  })

  useEffect(() => {
    const sumLetters = [...name].reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0,
    )
    setBgColor(availableColors[sumLetters % availableColors.length])
  }, [name])

  const classes = useStyles({ size, background: bgColor })
  const firstLetter = name.charAt(0).toUpperCase()

  return (
    <Avatar alt={name} src={img} classes={{ root: classes.root }}>
      <div className={classes.nameLetter}>{firstLetter}</div>
    </Avatar>
  )
}

UserAvatar.propTypes = propTypes
UserAvatar.defaultProps = defaultProps

export default memo(UserAvatar)
