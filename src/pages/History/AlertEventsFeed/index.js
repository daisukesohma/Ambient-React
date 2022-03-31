/*
 * author: rodaan@ambient.ai
 * The AlertEventsFeed Component used in investigations and Newsfeed
 * Uses ApolloClient Provider to access GraphQL
 * Meant to be independent so it doesn't rely on other components for things to work
 *
 * Can take an existing ws and method functions from a parent:
 * {
 *   ws,
 * }
 */
import React from 'react'
import PropTypes from 'prop-types'

import AlertEventsFeedGrid from './AlertEventsFeedGrid'
import AlertEventsFeedList from './AlertEventsFeedList'
import Skeleton from './Skeleton'
import PaginationAroundWrapper from 'components/Pagination/PaginationAroundWrapper'

/*
 * Handles querying and filtering
 * setWs can take a ws, 'none' or true
 */
function AlertEventsFeed({
  accountSlug,
  resolveAlert,
  alertEvents, // need
  changeCase,
  changePage, // need
  createCase,
  endTs,
  isGridView, // grid
  loading,
  page, // need
  pages, // need
  startTs,
}) {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        {loading && isGridView && <Skeleton />}
        {!loading && alertEvents.length > 0 && isGridView && (
          <PaginationAroundWrapper
            pageCount={pages}
            selectedPage={page}
            onPageChange={e => changePage(e.selected + 1)}
          >
            <AlertEventsFeedGrid
              accountSlug={accountSlug}
              alertEvents={alertEvents}
              endTs={endTs}
              handleResolveAlert={resolveAlert}
              handleChangeCase={changeCase}
              handleCreateCase={createCase}
              startTs={startTs}
            />
          </PaginationAroundWrapper>
        )}
        {!loading && !isGridView && (
          <AlertEventsFeedList
            alertEvents={alertEvents}
            endTs={endTs}
            handleResolveAlert={resolveAlert}
            handleChangeCase={changeCase}
            handleCreateCase={createCase}
            startTs={startTs}
          />
        )}
      </div>
    </div>
  )
}

AlertEventsFeed.propTypes = {
  accountSlug: PropTypes.string,
  resolveAlert: PropTypes.func,
  alertEvents: PropTypes.array,
  changeCase: PropTypes.func,
  changePage: PropTypes.func.isRequired,
  createCase: PropTypes.func,
  endTs: PropTypes.number,
  isGridView: PropTypes.bool,
  loading: PropTypes.bool,
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  startTs: PropTypes.number,
}

AlertEventsFeed.defaultProps = {
  accountSlug: '',
  alertEvents: [],
  changeCase: () => {},
  createCase: () => {},
  endTs: null,
  isGridView: true,
  loading: false,
  startTs: null,
}

export default AlertEventsFeed
