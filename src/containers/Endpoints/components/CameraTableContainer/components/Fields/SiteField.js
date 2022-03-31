import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import get from 'lodash/get'
import find from 'lodash/find'
// src
import SimpleLabel from 'components/Label/SimpleLabel'
import { SearchableSelectDropdown } from 'ambient_ui'
import { fetchSitesRequested } from 'redux/cameras/actions'

import useStyles from './styles'

export default function SiteField({ streamId, siteName }) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return (
    <div className={clsx('am-subtitle2', classes.baseText)}>
      <>
        {siteName}
        <span>
          <SimpleLabel>Site</SimpleLabel>
        </span>
      </>
    </div>
  )
}

SiteField.defaultProps = {
  siteName: '',
}

SiteField.propTypes = {
  siteName: PropTypes.string,
}
