import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// src
import {
  ActionsField,
  NameField,
  DataPointsField,
  DateCreatedField,
  ModeField,
  StatusField,
  IdField,
} from '../components/Fields'
import {
  campaignsFetchRequested,
  campaignSetLimit,
  campaignSetPage,
} from '../../../../redux/dataInfraSlice'

const columns = [
  {
    title: 'Name',
    render: NameField,
    field: 'campaignName',
    sorting: true,
    sortBy: 'name',
  },
  {
    title: 'ID',
    render: IdField,
    field: 'campaignId',
    sorting: true,
    sortBy: 'id',
  },
  {
    title: 'Data Points',
    render: DataPointsField,
    field: 'dataPoints',
    sorting: false,
  },
  {
    title: 'Date Created',
    render: DateCreatedField,
    field: 'dateCreated',
    sorting: false,
  },
  {
    title: 'Mode',
    render: ModeField,
    field: 'mode',
    sorting: false,
  },
  { title: 'Status', render: StatusField, field: 'status', sorting: true },
  { title: 'Actions', render: ActionsField },
]

const useTableData = ({ initLimit }) => {
  const dispatch = useDispatch()
  const campaigns = useSelector(state => state.dataInfra.campaigns)
  const isLoading = useSelector(state => state.dataInfra.campaignsLoading)
  const campaignSwitch = useSelector(state => state.dataInfra.campaignSwitch)
  const totalCount = useSelector(state => state.dataInfra.campaignsCount)
  const page = useSelector(state => state.dataInfra.campaignCurrentPage)
  const limit = useSelector(state => state.dataInfra.campaignLimit)
  const pages = useSelector(state => state.dataInfra.campaignPages)

  const [data, setData] = useState([])
  const setPage = newPage => dispatch(campaignSetPage({ page: newPage + 1 }))
  const setLimit = newLimit => dispatch(campaignSetLimit({ limit: newLimit }))

  useEffect(() => {
    if (campaignSwitch) {
      dispatch(
        campaignsFetchRequested({
          status: 'ARCHIVED',
          page,
          limit,
        }),
      )
    } else {
      dispatch(campaignsFetchRequested({ page, limit }))
    }
  }, [page, limit, dispatch, campaignSwitch])

  // Transform Campaign Data into Table Data
  useEffect(() => {
    const tableData = campaigns.map(campaign => {
      const {
        id,
        name,
        tsCreated,
        mode,
        status,
        numDataPoints,
        actions,
        validActions,
      } = campaign
      return {
        campaignId: id,
        campaignName: name,
        dateCreated: tsCreated,
        mode,
        status,
        numDataPoints,
        actions,
        validActions,
      }
    })
    setData(tableData)
  }, [dispatch, campaigns])

  return {
    columns,
    data,
    isLoading,
    limit,
    page,
    pages,
    setLimit,
    setPage,
    totalCountOverride: totalCount,
  }
}

export default useTableData
