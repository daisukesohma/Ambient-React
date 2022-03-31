import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import ReactPaginate from 'react-paginate'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'

import { Icon } from 'react-icons-kit'
import { chevronLeft } from 'react-icons-kit/feather/chevronLeft'
import { chevronRight } from 'react-icons-kit/feather/chevronRight'
import { chevronsLeft } from 'react-icons-kit/feather/chevronsLeft'
import { chevronsRight } from 'react-icons-kit/feather/chevronsRight'

import parseInt from 'lodash/parseInt'
import isNaN from 'lodash/isNaN'
import { isMobile } from 'react-device-detect'
import clsx from 'clsx'

import useStyles from './styles'

const propTypes = {
  onPageChange: PropTypes.func,
  pageCount: PropTypes.number,
  selectedPage: PropTypes.number,
  marginPagesDisplayed: PropTypes.number,
  pageRangeDisplayed: PropTypes.number,
  extended: PropTypes.bool,
  manual: PropTypes.bool,
}

const defaultProps = {
  onPageChange: () => {},
  pageCount: 1,
  selectedPage: 1,
  marginPagesDisplayed: 2,
  pageRangeDisplayed: 5,
  extended: true,
  manual: false,
}

const Pagination = ({
  onPageChange,
  pageCount,
  selectedPage,
  marginPagesDisplayed,
  pageRangeDisplayed,
  extended,
  manual,
}) => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ isMobile, darkMode })

  const [manualPage, setManualPage] = useState(selectedPage)

  const handlePageChange = page => {
    if (manual) setManualPage(page.selected + 1)
    onPageChange(page)
  }

  const normalizePage = page => {
    let normalizedPage = isNaN(page) ? 1 : page
    if (normalizedPage > pageCount) normalizedPage = pageCount
    if (normalizedPage < 1) normalizedPage = 1
    return normalizedPage - 1
  }

  const onKeyDown = event => {
    if (event.keyCode === 13) {
      event.preventDefault()
      const page = parseInt(manualPage)
      const selected = normalizePage(page)
      handlePageChange({ selected })
    }
  }

  const handleManualChange = event => {
    setManualPage(event.currentTarget.value)
  }

  const skipSeveral = step => event => {
    event.preventDefault()
    const page = selectedPage + step
    const selected = normalizePage(page)
    handlePageChange({ selected })
  }

  return (
    <Grid container alignItems='center' justify='center'>
      {extended && (
        <a
          className={clsx(classes.control, classes.controlLink)}
          onClick={skipSeveral(-10)}
        >
          <Icon icon={chevronsLeft} size={28} />
        </a>
      )}

      <ReactPaginate
        previousLabel={<Icon icon={chevronLeft} size={26} />}
        nextLabel={<Icon icon={chevronRight} size={26} />}
        breakLabel={<div className={classes.break}>...</div>}
        pageCount={pageCount}
        forcePage={selectedPage - 1}
        marginPagesDisplayed={marginPagesDisplayed}
        pageRangeDisplayed={pageRangeDisplayed}
        onPageChange={handlePageChange}
        containerClassName={classes.pagination}
        subContainerClassName='pages pagination'
        activeClassName={classes.active}
        pageClassName={classes.page}
        pageLinkClassName={classes.pageLink}
        nextClassName={classes.control}
        previousClassName={classes.control}
        previousLinkClassName={classes.controlLink}
        nextLinkClassName={classes.controlLink}
      />

      {extended && (
        <a
          className={clsx(classes.control, classes.controlLink)}
          onClick={skipSeveral(10)}
        >
          <Icon icon={chevronsRight} size={28} />
        </a>
      )}

      {manual && (
        <Box ml={1} width={100}>
          <TextField
            placeholder='Go to page…'
            value={manualPage}
            onChange={handleManualChange}
            onKeyDown={onKeyDown}
            classes={{ root: classes.manualInput }}
          />
        </Box>
      )}
    </Grid>
  )
}

Pagination.propTypes = propTypes
Pagination.defaultProps = defaultProps

export default Pagination
