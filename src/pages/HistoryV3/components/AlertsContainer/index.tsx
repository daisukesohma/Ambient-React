import React from 'react'
import { useSelector } from 'react-redux'
import PaginationAroundWrapper from 'components/Pagination/PaginationAroundWrapper'
import AlertsGrid from 'pages/HistoryV3/components/AlertsGrid'
import AlertsSkeleton from 'pages/HistoryV3/components/AlertsSkeleton'
import { AlertHistorySliceProps } from 'pages/HistoryV3/alertHistorySlice'

interface Props {
  alertEvents: []
  changePage?: (page: number) => void
  page?: number
  pages?: number
}

const defaultProps = {
  changePage: () => {},
  page: 1,
  pages: 1,
}

export default function AlertsContainer({
  alertEvents,
  changePage,
  page,
  pages,
}: Props): JSX.Element | null {
  const loadingAlertEvents = useSelector(
    (state: AlertHistorySliceProps) => state.alertHistoryV3.loadingAlertEvents,
  )

  if (loadingAlertEvents) return <AlertsSkeleton />

  if (alertEvents.length === 0) return null

  return (
    <PaginationAroundWrapper
      pageCount={pages}
      selectedPage={page}
      onPageChange={(event: { selected: number }) => {
        if (changePage) changePage(event.selected + 1)
      }}
    >
      <AlertsGrid />
    </PaginationAroundWrapper>
  )
}

AlertsContainer.defaultProps = defaultProps
