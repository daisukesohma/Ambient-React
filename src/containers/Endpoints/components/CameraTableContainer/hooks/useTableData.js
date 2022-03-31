import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { map, get } from 'lodash'

import { DateField } from 'components/atoms/fields'
import {
  findStreamsRequested,
  streamsHealthIsTableUpdated,
} from 'redux/cameras/actions'
import selectedSiteOption from 'selectors/cameras/selectedSiteOption'

import {
  ActionsField,
  CameraField,
  EmptyComment,
  FpsField,
  IpField,
  PingField,
  RegionField,
  SiteField,
  StatusField,
} from '../components/Fields'

const columns = [
  {
    title: 'Camera',
    render: CameraField,
    field: 'streamName',
    sorting: true,
    sortBy: 'name',
  },
  {
    title: 'Site',
    render: SiteField,
    field: 'siteName',
    sorting: true,
    sortBy: 'node__site__name',
  },
  {
    title: 'Region',
    render: RegionField,
    field: 'regionName',
    sorting: true,
    sortBy: 'region__name',
  },
  {
    title: 'IP / Hostname',
    render: IpField,
    field: 'hostname',
    sorting: false,
  },
  {
    title: 'Status',
    render: StatusField,
    field: 'status',
    sorting: true,
    sortBy: 'healthStatus',
  },
  {
    title: 'Date Added',
    render: ({ tsAdded }) => <DateField timestamp={tsAdded} />,
    field: 'tsAdded',
    sorting: true,
  },
  { title: 'Ping (ms)', render: PingField, field: 'ping', sorting: true },
  { title: 'FPS', render: FpsField, field: 'fps', sorting: true },
  { title: 'Actions', render: ActionsField },
]

const useTableData = ({ initLimit }) => {
  const dispatch = useDispatch()
  const { account } = useParams()
  const streams = useSelector(state => state.cameras.streams)
  const isLoading = useSelector(state => state.cameras.streamsLoading)
  const streamsHealthIds = useSelector(state => state.cameras.streamsHealthIds) // all streams for site
  const streamsSearch = useSelector(state => state.cameras.streamsSearch)
  const updateStreamSiteLoading = useSelector(
    state => state.cameras.updateStreamSiteLoading,
  )

  const sortBy = useSelector(state => state.cameras.sortBy)
  const sortOrder = useSelector(state => state.cameras.sortOrder)

  const [data, setData] = useState([])
  const selectedSite = useSelector(selectedSiteOption)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(initLimit || 25)
  const pages = useSelector(state => state.cameras.streamsPages)

  // Get Stream data on Site selection
  useEffect(() => {
    if (
      selectedSite &&
      !updateStreamSiteLoading // update stream list after updating site
    ) {
      dispatch(
        findStreamsRequested({
          accountSlug: account,
          siteSlug: selectedSite.slug,
          page: page + 1, // API request page number should start from 1
          limit,
          search: streamsSearch,
          sortBy,
          sortOrder,
        }),
      )
    }
    // eslint-disable-next-line
  }, [
    page,
    limit,
    account,
    dispatch,
    streamsSearch,
    sortOrder,
    sortBy,
    updateStreamSiteLoading,
  ])

  useEffect(() => {
    if (selectedSite) {
      setPage(0)
      dispatch(
        findStreamsRequested({
          accountSlug: account,
          siteSlug: selectedSite.slug,
          page: 1,
          limit,
          search: streamsSearch,
          sortBy,
          sortOrder,
        }),
      )
    }
    // eslint-disable-next-line
  }, [selectedSite])

  const formatPing = value => {
    if (!value) return '-'

    if (value < 0) {
      return -1
    }
    // if ping is in ms
    return value
  }

  const formatFps = value => {
    if (!value) return '-'
    if (value < 0) {
      return -1
    }
    return value
  }

  useEffect(() => {
    if (!updateStreamSiteLoading) {
      const tableData = map(streams, stream => {
        const { id, name, hostname, node, region, tsAdded } = stream
        return {
          regionName: get(region, 'name'),
          streamId: id,
          streamName: name,
          siteName: selectedSite.name,
          siteSlug: selectedSite.slug,
          hostname,
          node,
          tsAdded,
          status: stream.healthStatus,
          ping: formatPing(stream.ping),
          fps: formatFps(stream.fps),
        }
      })
      setData(tableData)
      dispatch(streamsHealthIsTableUpdated(false)) // needs health enrichment
    }
  }, [
    streams,
    dispatch,
    selectedSite,
    streamsHealthIds,
    updateStreamSiteLoading,
  ])

  return {
    columns,
    data,
    emptyComment: (
      <EmptyComment
        siteName={selectedSite ? selectedSite.name : null}
        isLoading={isLoading}
      />
    ),
    isLoading,
    limit,
    page,
    pages,
    setLimit,
    setPage,
    totalCountOverride: streamsHealthIds && streamsHealthIds.length,
  }
}

export default useTableData
