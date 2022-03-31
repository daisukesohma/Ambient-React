import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs'

import useStyles from './styles'

const BreadCrumbs = ({ items }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <MuiBreadcrumbs separator='›' aria-label='breadcrumb'>
        {items.map(item =>
          item.link ? (
            <Link to={item.link} className={classes.link}>
              <h3 className={`${classes.breadCrumbsItem} am-h6`}>
                {item.label}
              </h3>
            </Link>
          ) : (
            <h3 className={`${classes.breadCrumbsItem} am-h4`}>{item.label}</h3>
          ),
        )}
      </MuiBreadcrumbs>
    </div>
  )
}

BreadCrumbs.defaultProps = {
  items: [],
}

BreadCrumbs.propTypes = {
  items: PropTypes.array,
}

export default BreadCrumbs
