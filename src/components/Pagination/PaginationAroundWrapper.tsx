import React from 'react'

import Pagination from './index'

interface Props {
  hide?: boolean
  onPageChange?: (newPage: { selected: number }) => void
  pageCount?: number
  selectedPage?: number
  marginPagesDisplayed?: number
  pageRangeDisplayed?: number
  extended?: boolean
  manual?: boolean
  children: JSX.Element
}

const defaultProps = {
  hide: false,
  onPageChange: () => {},
  pageCount: 1,
  selectedPage: 1,
  marginPagesDisplayed: 2,
  pageRangeDisplayed: 5,
  extended: true,
  manual: false,
}

export default function PaginationAroundWrapper({
  hide,
  onPageChange,
  pageCount,
  selectedPage,
  marginPagesDisplayed,
  pageRangeDisplayed,
  extended,
  manual,
  children,
}: Props): JSX.Element {
  if (hide) return children

  const renderedPagination = (
    <Pagination
      onPageChange={onPageChange}
      pageCount={pageCount}
      selectedPage={selectedPage}
      marginPagesDisplayed={marginPagesDisplayed}
      pageRangeDisplayed={pageRangeDisplayed}
      extended={extended}
      manual={manual}
    />
  )

  return (
    <>
      {renderedPagination}
      {children}
      {renderedPagination}
    </>
  )
}

PaginationAroundWrapper.defaultProps = defaultProps
