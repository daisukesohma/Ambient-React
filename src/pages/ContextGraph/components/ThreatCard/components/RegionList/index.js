import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import map from 'lodash/map'

import { useCursorStyles } from 'common/styles/commonStyles'

import Region from './components/Region'
import useStyles from './styles'

// switch function based on length
function RegionDisplayList({ list }) {
  const length = list && list.length
  if (length === 0) {
    return <></>
  }

  if (length === 1) {
    return <Region data={list[0]} />
  }

  if (length === 2) {
    return <RegionAndList list={list} />
  }

  if (length > 2) {
    return (
      <>
        <RegionCommaList list={list.slice(0, length - 2)} />
        <RegionAndList list={list.slice(length - 2)} />
      </>
    )
  }

  return null
}

RegionDisplayList.propTypes = {
  list: PropTypes.array,
}

// Small utility for all comma delimited list
function RegionCommaList({ list }) {
  return map(list, (r, index) => (
    <Fragment key={`region-comma-list-item-${index}`}>
      <Region data={r} />
      <span>,</span>
    </Fragment>
  ))
}

RegionCommaList.propTypes = {
  list: PropTypes.array,
}

// small function for displaying two with AND
function RegionAndList({ list }) {
  const classes = useStyles()
  return (
    <>
      <Region data={list[0]} />
      <span className={classes.on}>and</span>
      <Region data={list[1]} />
    </>
  )
}

RegionAndList.propTypes = {
  list: PropTypes.array,
}

// MAIN FUNCTION
//
function RegionList({ data }) {
  const classes = useStyles()
  const cursorClasses = useCursorStyles()
  const DEFAULT_VISIBLE = 3 // How many regions to show before collapsing
  const allRegions = useSelector(state => state.contextGraph.regions)

  const [isExpandedVisible, setIsExpandedVisible] = useState(false)

  // naive check for all regions
  if (data.length === allRegions.length) {
    return (
      <>
        {!isExpandedVisible ? (
          <Region data='Anywhere' />
        ) : (
          <RegionDisplayList list={data} />
        )}
        <span
          className={classes.regionContainer}
          onClick={() => setIsExpandedVisible(!isExpandedVisible)}
        >
          <span
            className={clsx(
              'am-overline',
              cursorClasses.clickableText,
              classes.on,
            )}
          >
            {!isExpandedVisible ? '...Show All' : '...Hide'}
          </span>
        </span>
      </>
    )
  }

  // check for regions above max to show
  if (data.length > DEFAULT_VISIBLE) {
    // const count = data.length - DEFAULT_VISIBLE
    // <span>
    // {count} more {count === 1 ? 'region...' : 'regions...'}
    // </span>
    return (
      <>
        <span className={classes.on}>on</span>
        {!isExpandedVisible ? (
          <RegionCommaList list={data.slice(0, DEFAULT_VISIBLE)} />
        ) : (
          <RegionDisplayList list={data} />
        )}
        <span
          className={classes.regionContainer}
          onClick={() => setIsExpandedVisible(!isExpandedVisible)}
        >
          <span
            className={clsx(
              'am-overline',
              cursorClasses.clickableText,
              classes.on,
            )}
          >
            {!isExpandedVisible ? '...Show All' : '...Hide'}
          </span>
        </span>
      </>
    )
  }

  return (
    <>
      {data.length > 0 && <span className={classes.on}>on</span>}
      <RegionDisplayList list={data} />
    </>
  )
}

RegionList.propTypes = {
  data: PropTypes.array,
}

export default RegionList
