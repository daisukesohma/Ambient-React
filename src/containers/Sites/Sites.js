import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button, MoreOptionMenu } from 'ambient_ui'
import { get } from 'lodash'
import clsx from 'clsx'
// src
import { Can } from 'rbac'
import DataTable from 'components/organisms/DataTable'
import PageTitle from 'components/Page/Title'
import TableCell from 'components/Table/Cell'
import { useCursorStyles } from 'common/styles/commonStyles'
import useCommonStyles from 'common/styles/useCommonStyles'
import {
  fetchSitesByAccountRequested,
  fetchSiteUpTimeByAccountRequested,
  setSiteUpdating,
} from 'redux/sites/actions'

import UpdateSiteInfo from './components/UpdateSiteInfo'

export default function Sites() {
  const history = useHistory()
  const darkMode = useSelector(state => state.settings.darkMode)

  const dispatch = useDispatch()
  const { account } = useParams()
  const commonStyles = useCommonStyles({ darkMode })
  const cursorStyles = useCursorStyles()
  const [rows, setRows] = useState(undefined)
  const initialSites = useSelector(state => state.auth.sites)
  const [sites, setSites] = useState(initialSites)
  const loading = useSelector(state => state.sites.loading)
  const sitesCollection = useSelector(state =>
    get(state.sites, 'collection', []),
  )
  const siteUpTime = useSelector(state => get(state, 'sites.siteUpTime'))
  const [limit, setLimit] = useState(25)
  // let systemHealth = systemHealthMock // TESTING ONLY

  useEffect(() => {
    if (sitesCollection && sitesCollection.length === 0) {
      dispatch(fetchSitesByAccountRequested(account))
    }
    if (account) {
      dispatch(fetchSiteUpTimeByAccountRequested(account))
    }
    // eslint-disable-next-line
  }, [dispatch, account])

  // 1.
  useEffect(() => {
    if (sitesCollection && sitesCollection.length > 0) {
      setSites(sitesCollection)
    }
  }, [sitesCollection])

  // 2.
  useEffect(() => {
    if (sites) {
      const newRows = sites.map(site => ({
        name: site.name,
        site,
        nodes: site.nodes,
      }))
      setRows(newRows)
    }
  }, [sites, siteUpTime])

  function renderSiteName(rowData) {
    const { site } = rowData

    return (
      <div
        className={clsx(
          commonStyles.cellTextNormalPointer,
          cursorStyles.clickableText,
        )}
        onClick={() =>
          history.push(`/accounts/${account}/sites/${site.slug}/live`)
        }
      >
        {site.name}
      </div>
    )
  }

  function renderActions(rowData) {
    const menuItems = [
      {
        label: 'Edit Info',
        onClick: () => {
          dispatch(setSiteUpdating(rowData.site))
        },
      },
      {
        label: 'Start Stream Discovery',
        onClick: () => {
          history.push(
            `/accounts/${account}/infrastructure/discovery/create?site=${rowData.site.slug}`,
          )
        },
      },
    ]

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <MoreOptionMenu
          menuItems={menuItems}
          noBackground
          darkMode={darkMode}
        />
      </div>
    )
  }

  const columns = [
    {
      title: 'Site',
      field: 'name',
      render: renderSiteName,
      sorting: true,
    },
    {
      title: 'Location',
      field: 'site.address',
      render: row => <TableCell>{get(row, 'site.address')} </TableCell>,
      sorting: false,
    },
    {
      title: 'Threat Package',
      field: 'site.siteType.name',
      render: row => <TableCell>{get(row, 'site.siteType.name')}</TableCell>,
      sorting: false,
    },
    {
      title: 'Actions',
      render: renderActions,
      sorting: false,
    },
  ]

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <PageTitle title='Sites' darkMode={darkMode} />
        <Can I='is_internal' on='Admin'>
          <Button
            color='primary'
            variant='contained'
            onClick={() =>
              history.push(`/accounts/${account}/infrastructure/sites/new`)
            }
          >
            Add Site
          </Button>
        </Can>
      </div>
      {rows && (
        <DataTable
          isLoading={loading}
          columns={columns}
          darkMode={darkMode}
          data={rows}
          defaultRowsPerPage={limit}
          rowsPerPage={limit}
          setRowsPerPage={setLimit}
          showAddNowButton={false}
          defaultOrder='asc'
        />
      )}
      <UpdateSiteInfo />
    </div>
  )
}
