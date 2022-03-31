import React from 'react'
import PropTypes from 'prop-types'

PageTitle.defaultProps = {
  title: '',
  sizeClass: 'am-h4',
}

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  sizeClass: PropTypes.string,
}

export default function PageTitle({ title, sizeClass }) {
  return <div className={sizeClass}>{title}</div>
}
