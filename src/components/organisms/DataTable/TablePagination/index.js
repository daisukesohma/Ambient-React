import React from 'react'
import PropTypes from 'prop-types'
import { isMobile } from 'react-device-detect'

import Pagination from 'components/Pagination'

import useStyles from './styles'

function TablePagination({ pageCount, selectedPage, onPageChange }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Pagination
        previousLabel='Previous'
        nextLabel='Next'
        breakLabel='...'
        breakClassName='break-me'
        pageCount={pageCount}
        selectedPage={selectedPage}
        marginPagesDisplayed={2}
        pageRangeDisplayed={isMobile ? 2 : 5}
        onPageChange={onPageChange}
        containerClassName='pagination'
        subContainerClassName='pages pagination'
        activeClassName='active'
      />
    </div>
  )
}

TablePagination.defaultProps = {
  pageCount: 0,
  selectedPage: 0,
  onPageChange: () => {},
}

TablePagination.propTypes = {
  pageCount: PropTypes.number,
  selectedPage: PropTypes.number,
  onPageChange: PropTypes.func,
}

export default TablePagination
