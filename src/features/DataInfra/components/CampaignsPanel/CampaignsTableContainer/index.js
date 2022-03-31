import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
// src
import DataTable from 'components/organisms/DataTable'
import { useFlexStyles } from 'common/styles/commonStyles'
import ConfirmDialog from 'components/ConfirmDialog'

import {
  campaignsFetchRequested,
  confirmDialogClose,
  archiveCampaignRequested,
  stopCampaignRequested,
  startCampaignRequested,
  deleteCampaignRequested,
} from '../../../redux/dataInfraSlice'
import { INIT_LIMIT } from '../../../constants'

import {
  campaignActionToReadable,
  campaignStates,
  irreversableStates,
} from './enums'
import RefreshTableData from './components/RefreshTableData'
import useTableData from './hooks/useTableData'
import useStyles from './styles'

const CampaignsContainer = () => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()

  const confirmDialogOpened = useSelector(
    state => state.dataInfra.confirmDialogOpened,
  )
  const campaignAction = useSelector(state => state.dataInfra.campaignAction)
  const campaignId = useSelector(state => state.dataInfra.campaignId)
  const campaignLoading = useSelector(state => state.dataInfra.campaignLoading)
  const campaignSwitch = useSelector(state => state.dataInfra.campaignSwitch)

  const {
    columns,
    data,
    isLoading,
    limit,
    page,
    pages,
    setLimit,
    setPage,
    totalCountOverride,
  } = useTableData({ INIT_LIMIT })

  const refreshCampaigns = () => {
    const state = {
      page: 1,
      limit,
    }
    if (campaignSwitch) {
      state.status = campaignStates.ARCHIVED
    }
    dispatch(campaignsFetchRequested(state))
  }

  const additionalTools = (
    <div className={clsx(flexClasses.row, flexClasses.centerStart)}>
      <span className={classes.additionalToolsContainer}>
        <RefreshTableData handleFetch={refreshCampaigns} />
      </span>
    </div>
  )

  const handleCloseConfirmDialog = () => {
    dispatch(confirmDialogClose())
  }

  const handleActionConfirm = () => {
    switch (campaignAction) {
      case campaignStates.STARTED:
        dispatch(
          startCampaignRequested({
            dataCampaignId: campaignId,
            page,
            limit,
            campaignSwitch,
          }),
        )
        break
      case campaignStates.DELETED:
        dispatch(
          deleteCampaignRequested({
            dataCampaignId: campaignId,
            page,
            limit,
            campaignSwitch,
          }),
        )
        break
      case campaignStates.ARCHIVED:
        dispatch(
          archiveCampaignRequested({
            dataCampaignId: campaignId,
            page,
            limit,
            campaignSwitch,
          }),
        )
        break
      case campaignStates.STOPPED:
        dispatch(
          stopCampaignRequested({
            dataCampaignId: campaignId,
            page,
            limit,
            campaignSwitch,
          }),
        )
        break
      default:
        break
    }
  }

  return (
    <div>
      <DataTable
        additionalTools={additionalTools}
        darkMode={darkMode}
        serverSideProcessing
        page={page - 1}
        pages={pages}
        setPage={setPage}
        rowsPerPage={limit}
        setRowsPerPage={setLimit}
        columns={columns}
        data={data}
        isPaginated={true}
        defaultRowsPerPage={limit}
        isLoading={isLoading}
        showAddNowButton={false}
        totalCountOverride={totalCountOverride}
      />
      <ConfirmDialog
        open={confirmDialogOpened}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleActionConfirm}
        loading={campaignLoading}
        content={`You are about to ${
          campaignActionToReadable[campaignAction]
        } this campaign.
          Are you sure you want to do this?
          ${
            irreversableStates.includes(campaignAction)
              ? 'This is irreversable.'
              : ''
          }`}
      />
    </div>
  )
}

export default CampaignsContainer
