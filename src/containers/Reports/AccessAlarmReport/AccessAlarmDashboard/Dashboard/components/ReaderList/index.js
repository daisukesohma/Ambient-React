import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { useSelector, useDispatch } from 'react-redux'
import { Icons, DropdownMenu } from 'ambient_ui'
import { useTheme } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import DataTable from 'components/organisms/DataTable'
import { fetchAccessReaderListRequested } from 'redux/slices/accessAlarmDashboard'
import { ModalTypeEnum } from 'enums'
import { showModal } from 'redux/slices/modal'
import clsx from 'clsx'
import config from 'config'

import useStyles from './styles'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

const isDemo = config.settings.demo

const { Check, Close, Door } = Icons

const propTypes = {
  accessAlarmType: PropTypes.string.isRequired,
}

const ReaderList = ({ accessAlarmType }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { account } = useParams()
  const [globalSelectedSite] = useGlobalSelectedSite(true)
  const startTs = useSelector(state =>
    get(state, 'accessAlarmDashboard.startTs', null),
  )
  const endTs = useSelector(state =>
    get(state, 'accessAlarmDashboard.endTs', null),
  )
  const darkMode = useSelector(state => state.settings.darkMode)
  const accessReaderList = useSelector(state =>
    get(state, `accessAlarmDashboard.accessReaderList.${accessAlarmType}`, []),
  )
  const accessAlarmTypeDistributions = useSelector(state =>
    get(state, 'accessAlarmDashboard.accessAlarmTypeDistributions', []),
  )

  const offenderOptions = [
    { label: 'Top 10 Offenders', value: 10 },
    { label: 'Top 20 Offenders', value: 20 },
  ]

  const tableColumns = [
    { title: 'Reader', field: 'name' },
    { title: 'Volume', field: 'volume' },
    { title: '% Total', field: 'totalPercent' },
    {
      title: 'On Ambient',
      field: 'onAmbient',
      render: row => {
        return (
          <Grid container alignItems='center' wrap='nowrap'>
            {row.onAmbient ? (
              <Check stroke={theme.palette.primary[400]} />
            ) : (
              <Close stroke={theme.palette.error.main} />
            )}
            {row.stream ? (
              <div
                onClick={row.viewStream}
                style={{
                  cursor: 'pointer',
                  marginLeft: 8,
                }}
              >
                {row.stream}
              </div>
            ) : (
              <div
                style={{
                  marginLeft: 8,
                }}
              >
                No Stream Attached
              </div>
            )}
          </Grid>
        )
      },
    },
  ]

  const _data = accessAlarmTypeDistributions.find(
    i => i.name === accessAlarmType,
  )

  const classes = useStyles({ darkMode })

  const totalCount = _data ? _data.value : 0
  const [dataCount, setDataCount] = useState(10)

  const viewStream = reader => () => {
    const streamName = get(reader, 'stream.name')
    const regionName = get(reader, 'stream.region.name')
    const streamId = get(reader, 'stream.id')
    const nodeId = get(reader, 'stream.node.identifier', '')
    const _siteSlug = get(reader, 'site.slug', '')
    const siteName = get(reader, 'site.name', '')
    dispatch(
      showModal({
        content: {
          streamName,
          regionName,
          streamId,
          nodeId,
          siteName,
          siteSlug: _siteSlug,
        },
        type: ModalTypeEnum.VIDEO,
      }),
    )
  }

  useEffect(() => {
    if (isDemo) {
      return
    }
    dispatch(
      fetchAccessReaderListRequested({
        accountSlug: account,
        siteSlugs: globalSelectedSite ? [globalSelectedSite] : undefined,
        startTs,
        endTs,
        accessAlarmType,
      }),
    )
  }, [account, globalSelectedSite, startTs, endTs, dispatch, accessAlarmType])

  const tableData = accessReaderList.map(d => {
    return {
      name: get(d, 'reader.deviceId', ''),
      stream: get(d, 'reader.stream.name', ''),
      volume: d.alertCount,
      totalPercent: totalCount
        ? ((100 * d.alertCount) / totalCount).toFixed(2)
        : 0,
      onAmbient: d.onAmbient,
      viewStream: viewStream(d.reader),
    }
  })

  const downloadData = accessReaderList.map(d => {
    return {
      name: get(d, 'reader.deviceId', ''),
      stream: get(d, 'reader.stream.name', ''),
      volume: d.alertCount,
      totalPercent: totalCount
        ? ((100 * d.alertCount) / totalCount).toFixed(2)
        : 0,
      onAmbient: d.onAmbient,
    }
  })

  return (
    <div className={clsx(classes.tables, classes.paper)}>
      <div className={classes.tableHeader}>
        <div className={classes.tableTitle}>
          <Door
            width={24}
            height={24}
            stroke={
              darkMode ? theme.palette.common.white : theme.palette.common.black
            }
          />
          <h6
            className={`MuiTypography-root MuiTypography-h6 ${classes.tableTitleH}`}
          >
            {accessAlarmType}
          </h6>
        </div>
        <DropdownMenu
          menuItems={offenderOptions}
          selectedItem={offenderOptions.find(item => item.value === dataCount)}
          handleSelection={option => setDataCount(option.value)}
        />
      </div>
      <DataTable
        darkMode={darkMode}
        isDownloadable
        downloadableData={downloadData}
        downloadableFileName={`${accessAlarmType
          .toLowerCase()
          .replace(' ', '-')}-readers.csv`}
        columns={tableColumns}
        data={tableData}
        defaultRowsPerPage={dataCount}
        isPaginated={false}
        isCountVisible={false}
        showAddNowButton={false}
        defaultOrder='desc'
        defaultOrderBy='volume'
      />
    </div>
  )
}

ReaderList.propTypes = propTypes

export default ReaderList
