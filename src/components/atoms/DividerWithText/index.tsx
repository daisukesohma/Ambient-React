import React from 'react'
import clsx from 'clsx'

import useStyles from './styles'

interface Props {
  text: string
  darkMode: boolean
  fontSize: number
  borderSize: number
  contentWidth: string | number
}

const DividerWithText = ({
  text,
  darkMode = false,
  fontSize = 12,
  borderSize = 1,
  contentWidth = '60%',
}: Props): JSX.Element => {
  const classes = useStyles({ darkMode, fontSize, borderSize, contentWidth })
  return (
    <div className={classes.container}>
      <span className={clsx(classes.content, 'am-overline')}>{text}</span>
      <div className={classes.border} />
    </div>
  )
}
export default DividerWithText
