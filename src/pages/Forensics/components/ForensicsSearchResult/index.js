import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
// src
import Pagination from 'components/Pagination'
import { setSelectedPage, resetSearch } from 'redux/forensics/actions'
import { useFlexStyles, useCursorStyles } from 'common/styles/commonStyles'

import useForensicData from '../../hooks/useForensicData'
import ForensicsCardContainer from '../ForensicsCardContainer'
import ForensicsLoadingResultCount from '../../../../components/ForensicsLoadingResultCount'

import useStyles from './styles'
import { Grid } from '@material-ui/core'

export default function ForensicsSearchResult() {
  const dispatch = useDispatch()
  const cursorClasses = useCursorStyles()
  const loading = useSelector(state => state.forensics.loadingSearch)
  const totalCount = useSelector(state => state.forensics.searchTotalCount)
  const results = useSelector(state => state.forensics.searchResults)
  const pages = useSelector(state => state.forensics.searchPages)
  const selectedPage = useSelector(state => state.forensics.searchSelectedPage)
  const activeStream = useSelector(state => state.forensics.activeStream)

  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const [_, fetchEntities] = useForensicData() // eslint-disable-line

  const onPageChange = e => {
    dispatch(setSelectedPage(e.selected + 1))
  }

  // we don't need to check dependencies here because siteSlug, account, activeRegion changes
  // will be handled inside parent component
  useEffect(() => {
    fetchEntities({ page: selectedPage })
  }, [selectedPage]) // eslint-disable-line

  useEffect(() => {
    fetchEntities()
  }, [activeStream]) // eslint-disable-line

  const handleResetSearch = () => {
    dispatch(resetSearch())
  }

  return (
    <Grid
      container
      item
      justify='flex-start'
      alignItems='center'
      className={classes.root}
      id='forensics-search-results'
    >
      <Grid item className={classes.results} xs={12} sm={12} md={12} lg={12}>
        {(loading || pages) && (
          <div
            className={clsx(
              flexClasses.row,
              flexClasses.centerBetween,
              classes.headerBar,
            )}
          >
            <div className='am-h5'>Search Results</div>
            <ForensicsLoadingResultCount count={totalCount} loading={loading} />
          </div>
        )}
        {results.length > 0 && (
          <Grid
            className={clsx(
              classes.streamsContainer,
              flexClasses.row,
              loading && classes.streamsContainerLoading,
            )}
            alignItems='center'
            justify='center'
          >
            {results.map(result => (
              <ForensicsCardContainer
                data={result}
                key={`result-${result.stream.id}-${result.ts}`}
              />
            ))}
          </Grid>
        )}
        {pages && results.length === 0 && !loading && (
          <>
            <div className={classes.streamsContainer}>
              <div className='am-h5'>No results. Try changing your search.</div>
              <div
                style={{ marginTop: 16 }}
                className={clsx(
                  'am-h5',
                  cursorClasses.pointer,
                  cursorClasses.clickableText,
                )}
                onClick={handleResetSearch}
              >
                Reset Search
              </div>
            </div>
          </>
        )}
      </Grid>
      {pages > 1 && (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Pagination
            manual={true}
            extended={false}
            pageCount={pages}
            selectedPage={selectedPage}
            onPageChange={onPageChange}
            pageRangeDisplayed={2}
          />
        </Grid>
      )}
    </Grid>
  )
}
