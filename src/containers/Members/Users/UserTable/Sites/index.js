import React from 'react'
import PropTypes from 'prop-types'
import Chip from '@material-ui/core/Chip'
import Popover from '@material-ui/core/Popover'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

import useStyles from './styles'

const Sites = ({ sites }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const initialNum = 2

  const firstView = []
  const secondView = []

  sites.forEach((site, index) => {
    if (index < initialNum) {
      firstView.push(site)
    } else {
      secondView.push(site)
    }
  })

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'popover' : undefined

  const renderChips = sitesArray => {
    return sitesArray.map((site, index) => (
      <Chip
        key={index}
        label={site.label}
        classes={{ label: classes.label, root: classes.root }}
      />
    ))
  }

  return (
    <>
      {renderChips(firstView)}
      {secondView.length > 0 && (
        <>
          <Chip
            icon={<MoreHorizIcon className={classes.moreIcon} />}
            classes={{ label: classes.moreLabel, root: classes.root }}
            onClick={handleClick}
            clickable
          />
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <div className={classes.more}>{renderChips(secondView)}</div>
          </Popover>
        </>
      )}
    </>
  )
}

Sites.defaultProps = {
  sites: [],
}

Sites.propTypes = {
  sites: PropTypes.array,
}

export default Sites
