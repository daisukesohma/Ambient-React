/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import map from 'lodash/map'
// src
import { Box, Chip, Grid, Typography } from '@material-ui/core'
import DataTable from 'components/organisms/DataTable'
import find from 'lodash/find'
import DateTimeRangePickerV3 from 'components/organisms/DateTimeRangePickerV3'
import Performance from 'pages/AlertsInternal/components/Performance'
import { get } from 'lodash'
import { SettingsSliceProps } from 'redux/slices/settings'

import useStyles from './styles'
import {
  ThreatSignatureFailureModeSliceProps,
  fetchFailureModesRequested,
  fetchThreatSignaturesRequested,
  addFailureModeRequested,
  deleteFailureModeRequested,
  setDates,
} from './redux/threatSignatureFailureModeSlice'
import Name from './components/Name'

interface RowData {
  name: string
  id: number
  validFailureModes: number[]
  selected: boolean
  dismissedRatio: number
  numPositive: number
  numNegative: number
}

const columns = [
  {
    title: 'Name',
    field: 'name',
    render: Name,
    sorting: false,
  },
  {
    title: 'Performance',
    sorting: false,
    render: (rowData: RowData) => {
      return (
        <Performance
          dismissedRatio={rowData.dismissedRatio}
          numPositive={rowData.numPositive}
          numNegative={rowData.numNegative}
        />
      )
    },
  },
]

export default function ThreatSignatureFailureMode(): JSX.Element {
  const dispatch = useDispatch()
  const darkMode = useSelector(
    (state: SettingsSliceProps) => state.settings.darkMode,
  )
  const failureModes = useSelector(
    (state: ThreatSignatureFailureModeSliceProps) =>
      state.threatSignatureFailureMode.failureModes,
  )
  const threatSignatures = useSelector(
    (state: ThreatSignatureFailureModeSliceProps) =>
      state.threatSignatureFailureMode.threatSignatures,
  )
  const threatSignature = useSelector(
    (state: ThreatSignatureFailureModeSliceProps) =>
      state.threatSignatureFailureMode.threatSignature,
  )
  const threatSignaturesLoading = useSelector(
    (state: ThreatSignatureFailureModeSliceProps) =>
      state.threatSignatureFailureMode.threatSignaturesLoading,
  )
  const selectedThreatSignature = find(threatSignatures, [
    'id',
    threatSignature,
  ])
  const editFailureModesLoading = useSelector(
    (state: ThreatSignatureFailureModeSliceProps) =>
      state.threatSignatureFailureMode.editFailureModesLoading,
  )

  const tsStart = useSelector(
    (state: ThreatSignatureFailureModeSliceProps) =>
      state.threatSignatureFailureMode.tsStart,
  )

  const tsEnd = useSelector(
    (state: ThreatSignatureFailureModeSliceProps) =>
      state.threatSignatureFailureMode.tsEnd,
  )

  const processedThreatSignatures = map(threatSignatures, ts => {
    return {
      name: ts.name,
      id: ts.id,
      validFailureModes: ts.validFailureModes,
      selected: ts.id === threatSignature,
      dismissedRatio: get(ts, 'performanceMetrics.dismissedRatio', null),
      numPositive: get(ts, 'performanceMetrics.numPositive', null),
      numNegative: get(ts, 'performanceMetrics.numNegative', null),
    }
  })

  const handleDateChange = (dates: number[]) => {
    dispatch(setDates({ tsStart: dates[0], tsEnd: dates[1] }))
  }

  useEffect(() => {
    const startTs = tsStart === tsEnd ? null : tsStart
    const endTs = tsStart === tsEnd ? null : tsEnd
    batch(() => {
      dispatch(fetchFailureModesRequested())
      dispatch(
        fetchThreatSignaturesRequested({ tsStart: startTs, tsEnd: endTs }),
      )
    })
  }, [dispatch, tsStart, tsEnd])

  // eslint-disable-next-line
  const classes = useStyles({ darkMode })

  return (
    <Grid container spacing={4} alignItems='flex-start' direction='row'>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Box>
            <div className='am-h4'>Threat Signatures</div>
          </Box>
          <Box />
        </Box>
      </Grid>
      <div className={classes.datePicker}>
        <Typography className={classes.datePickerLabel}>
          Performance Window
        </Typography>
        <DateTimeRangePickerV3
          darkMode={darkMode}
          startTs={tsStart}
          endTs={tsEnd}
          onChange={handleDateChange}
        />
      </div>
      <Grid item container spacing={4}>
        <Grid item lg={6} md={6} sm={6} xs={6}>
          <Box className={classes.border}>
            <DataTable
              isCountVisible={false}
              isPaginated={false}
              isSearchable
              darkMode={darkMode}
              data={processedThreatSignatures}
              columns={columns}
              defaultRowsPerPage={threatSignatures.length}
              isLoading={threatSignaturesLoading}
            />
          </Box>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6}>
          <Box className={classes.failureModeContainer}>
            <div className={classes.failureModeBox}>
              <Typography>Failure Modes</Typography>
              {map(failureModes, fm => {
                if (
                  threatSignature &&
                  find(selectedThreatSignature!.validFailureModes, [
                    'id',
                    fm.id,
                  ])
                ) {
                  return (
                    <div className={classes.failureMode}>
                      <Chip
                        color='primary'
                        label={fm.name}
                        disabled={
                          editFailureModesLoading || threatSignaturesLoading
                        }
                        onClick={() => {
                          const startTs = tsStart === tsEnd ? null : tsStart
                          const endTs = tsStart === tsEnd ? null : tsEnd
                          dispatch(
                            deleteFailureModeRequested({
                              input: {
                                threatSignatureId: threatSignature,
                                failureModeId: fm.id,
                              },
                              tsStart: startTs,
                              tsEnd: endTs,
                            }),
                          )
                        }}
                      />
                    </div>
                  )
                }
                if (threatSignature) {
                  return (
                    <div className={classes.failureMode}>
                      <Chip
                        label={fm.name}
                        disabled={
                          editFailureModesLoading || threatSignaturesLoading
                        }
                        onClick={() => {
                          const startTs = tsStart === tsEnd ? null : tsStart
                          const endTs = tsStart === tsEnd ? null : tsEnd
                          dispatch(
                            addFailureModeRequested({
                              input: {
                                threatSignatureId: threatSignature,
                                failureModeId: fm.id,
                              },
                              tsStart: startTs,
                              tsEnd: endTs,
                            }),
                          )
                        }}
                      />
                    </div>
                  )
                }
                return (
                  <div className={classes.failureMode}>
                    <Chip
                      label={fm.name}
                      onClick={() => {}}
                      disabled={
                        editFailureModesLoading || threatSignaturesLoading
                      }
                    />
                  </div>
                )
              })}
            </div>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )
}
