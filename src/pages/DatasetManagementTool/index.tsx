import React, { useEffect, useState } from 'react'
import { filter, find, get, isEmpty, map } from 'lodash'
import { Card, LinearProgress, Grid, Button } from '@material-ui/core'
import { batch, useDispatch, useSelector } from 'react-redux'
import { ValueType } from 'react-select'
import { Icon } from 'react-icons-kit'
import { info } from 'react-icons-kit/feather/info'
// src
import { SettingsSliceProps } from 'redux/slices/settings'
import PaginationAroundWrapper from 'components/Pagination/PaginationAroundWrapper'
import { SearchableSelectDropdown } from 'ambient_ui'
import { SiteOption } from 'ambient_ui/components/menus/SearchableSelectDropdown/types'

import useStyles from './styles'
import {
  updateLoginRequested,
  getAllDatasetsRequested,
  DMSProps,
  DatapointType,
  getAllDatapointsRequested,
  getAllDatasplitsRequested,
  selectSplit,
  getDatasplitsByDatasetRequested,
  getDatapointsByDatasplitRequested,
  getDatapointsByDatasetRequested,
  modalToggle,
} from './redux/dmsSlice'
import DatapointModal from './components/DatapointModal'
import DataDetails from './components/DataDetails'
import DMSLogin from './components/Login'

interface NewPage {
  selected: number
}

export default function VerificationPortal(): JSX.Element {
  const dispatch = useDispatch()
  const classes = useStyles()
  const token = useSelector((state: DMSProps) => state.dms.token)
  const page = useSelector((state: DMSProps) => state.dms.page)
  const pages = useSelector((state: DMSProps) => state.dms.pages)
  const pageSize = useSelector((state: DMSProps) => state.dms.pageSize)
  const datasets = useSelector((state: DMSProps) => state.dms.datasets)
  const datasetPointCount = useSelector(
    (state: DMSProps) => state.dms.datasetPointCount,
  )
  const datasplits = useSelector((state: DMSProps) => state.dms.datasplits)
  const datapoints = useSelector((state: DMSProps) => state.dms.datapoints)
  const datapointCount = useSelector(
    (state: DMSProps) => state.dms.datapointCount,
  )
  const allDatapointCount = useSelector(
    (state: DMSProps) => state.dms.allDatapointCount,
  )
  const selectedDataset = useSelector(
    (state: DMSProps) => state.dms.selectedDataset,
  )
  const selectedDatasplit = useSelector(
    (state: DMSProps) => state.dms.selectedDatasplit,
  )

  const darkMode = useSelector(
    (state: SettingsSliceProps) => state.settings.darkMode,
  )
  const loading = useSelector((state: DMSProps) => state.dms.loading)
  const imageLoading = useSelector((state: DMSProps) => state.dms.imageLoading)
  const modalOpen = useSelector((state: DMSProps) => state.dms.modalOpen)
  const [
    selectedDatapoint,
    setSelectedDatapoint,
  ] = useState<null | DatapointType>(null)
  const [index, setIndex] = useState<null | number>(null)
  const [datasetDetailsOpen, setDatasetDetailsOpen] = useState(false)
  const [datasplitDetailsOpen, setDatasplitDetailsOpen] = useState(false)

  useEffect(() => {
    if (token) {
      batch(() => {
        dispatch(getAllDatasetsRequested({ page: 1, pageSize: 100 }))
        dispatch(getAllDatasplitsRequested({ page: 1, pageSize: 100 }))
        dispatch(getAllDatapointsRequested({ page: 1, pageSize: 100 }))
      })
    }
  }, [token, dispatch])

  const onChangePage = (newPage: NewPage) => {
    if (selectedDatasplit) {
      dispatch(
        getDatapointsByDatasplitRequested({
          name: selectedDatasplit,
          page: newPage.selected + 1,
          pageSize,
        }),
      )
    } else if (selectedDataset) {
      dispatch(
        getDatapointsByDatasetRequested({
          name: selectedDataset,
          page: newPage.selected + 1,
          pageSize,
        }),
      )
    } else {
      dispatch(
        getAllDatapointsRequested({ page: newPage.selected + 1, pageSize }),
      )
    }
  }

  // eslint-disable-line
  function isSiteOption(object: any): object is SiteOption {
    return 'value' in object
  }

  const onSetSelect = (selected: ValueType<SiteOption, boolean> | null) => {
    if (selected && isSiteOption(selected)) {
      if (get(selected, 'value', null)) {
        dispatch(
          getDatasplitsByDatasetRequested({
            name: selected!.value,
            page: 1,
            pageSize: 100,
            currentDatasplit: selectedDatasplit,
          }),
        )
      } else {
        if (!selectedDatasplit) {
          dispatch(getAllDatapointsRequested({ page: 1, pageSize: 100 }))
        }
        dispatch(getAllDatasplitsRequested({}))
      }
    }
  }

  const onSplitSelect = (selected: ValueType<SiteOption, boolean> | null) => {
    if (selected && isSiteOption(selected)) {
      if (get(selected, 'value', null)) {
        dispatch(
          getDatapointsByDatasplitRequested({
            name: selected!.value,
            page: 1,
            pageSize: 100,
          }),
        )
      } else {
        if (selectedDataset) {
          dispatch(
            getDatapointsByDatasetRequested({
              name: selectedDataset,
              page: 1,
              pageSize: 100,
            }),
          )
        } else {
          dispatch(getAllDatapointsRequested({ page: 1, pageSize }))
        }
        dispatch(selectSplit({ value: null }))
      }
    }
  }

  const toggleModal = () => {
    dispatch(modalToggle())
  }

  const ALL_DATASETS = {
    label: 'All Datasets',
    value: null,
  }

  const ALL_DATASPLITS = {
    label: 'All Datasplits',
    value: null,
  }

  const datasetOptions: SiteOption[] = [
    ALL_DATASETS,
    ...map(datasets, dataset => {
      return {
        value: dataset.datasetName,
        label: dataset.datasetName,
      }
    }),
  ]

  const datasplitOptions: SiteOption[] = [
    ALL_DATASPLITS,
    ...map(datasplits, datasplit => {
      return {
        value: datasplit.datasplitName,
        label: datasplit.datasplitName,
      }
    }),
  ]

  const forward = () => {
    if (index !== null && index < datapointCount) {
      setSelectedDatapoint(datapoints[index + 1])
      setIndex(index + 1)
    }
  }
  const back = () => {
    if (index !== null && index > 0) {
      setSelectedDatapoint(datapoints[index - 1])
      setIndex(index - 1)
    }
  }

  const onConfirm = ({
    username,
    password,
  }: {
    username: string
    password: string
  }) => {
    dispatch(
      updateLoginRequested({
        variables: {
          username,
          password,
        },
      }),
    )
  }

  const datasetSelected: SiteOption[] = filter(
    datasetOptions,
    (dataset: SiteOption) => dataset.value === selectedDataset,
  )

  const datasplitSelected: SiteOption[] = filter(
    datasplitOptions,
    (datasplit: SiteOption) => datasplit.value === selectedDatasplit,
  )

  if (token.length === 0) {
    return <DMSLogin onConfirm={onConfirm} loading={loading} />
  }

  return (
    <div>
      <DatapointModal
        datapoint={selectedDatapoint}
        modalOpen={modalOpen}
        onClose={() => {
          toggleModal()
          setIndex(null)
        }}
        index={index}
        count={datapointCount}
        forward={forward}
        back={back}
      />
      <div className='am-h4' style={{ textAlign: 'left', marginBottom: 24 }}>
        Dataset Management
      </div>
      <Grid container direction='row' spacing={2}>
        <Grid
          container
          direction='row'
          spacing={1}
          item
          lg={6}
          md={6}
          sm={12}
          xs={12}
          alignItems='center'
        >
          <Grid item lg={10} md={10} sm={10} xs={10}>
            <SearchableSelectDropdown
              placeholder='Filter by Dataset'
              options={datasetOptions}
              onChange={onSetSelect}
              value={
                isEmpty(datasetSelected) ? ALL_DATASETS : datasetSelected[0]
              }
              darkMode={darkMode}
            />
          </Grid>
          <Grid item lg={2} md={2} sm={2} xs={2}>
            <DataDetails
              count={selectedDataset ? datasetPointCount : allDatapointCount}
              datasplitCount={datasplits.length}
              name={selectedDataset}
              data={find(datasets, ['datasetName', selectedDataset])}
              open={datasetDetailsOpen}
              darkMode={darkMode}
              handleClose={() => setDatasetDetailsOpen(false)}
            >
              <Button
                onClick={() => setDatasetDetailsOpen(!datasetDetailsOpen)}
              >
                <Icon icon={info} size={24} />
              </Button>
            </DataDetails>
          </Grid>
        </Grid>
        <Grid
          container
          direction='row'
          spacing={1}
          item
          lg={6}
          md={6}
          sm={12}
          xs={12}
          alignItems='center'
        >
          <Grid item lg={10} md={10} sm={10} xs={10}>
            <SearchableSelectDropdown
              placeholder='Filter by Datasplit'
              options={datasplitOptions}
              onChange={onSplitSelect}
              value={
                isEmpty(datasplitSelected)
                  ? ALL_DATASPLITS
                  : datasplitSelected[0]
              }
              darkMode={darkMode}
            />
          </Grid>
          <Grid item lg={2} md={2} sm={2} xs={2}>
            <DataDetails
              count={datapointCount}
              name={selectedDatasplit}
              data={find(datasplits, ['datasplitName', selectedDatasplit])}
              open={datasplitDetailsOpen}
              darkMode={darkMode}
              handleClose={() => setDatasplitDetailsOpen(false)}
            >
              <Button
                onClick={() => setDatasplitDetailsOpen(!datasplitDetailsOpen)}
              >
                <Icon icon={info} size={24} />
              </Button>
            </DataDetails>
          </Grid>
        </Grid>
      </Grid>

      {(loading || imageLoading) && (
        <Grid>
          <LinearProgress />
        </Grid>
      )}

      {!(loading || imageLoading) && (
        <PaginationAroundWrapper
          hide={false}
          marginPagesDisplayed={1}
          pageRangeDisplayed={1}
          extended
          manual
          pageCount={pages}
          onPageChange={onChangePage}
          selectedPage={page + 1}
        >
          <Grid container spacing={3}>
            {map(datapoints, (datapoint, i) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  key={datapoint.dataFile}
                >
                  <Card
                    classes={{ root: classes.card }}
                    onClick={() => {
                      toggleModal()
                      setSelectedDatapoint(datapoint)
                      setIndex(i)
                    }}
                  >
                    <img
                      src={datapoint.presignedDataUrl}
                      alt={datapoint.dataFile}
                      width={200}
                      height={150}
                    />
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </PaginationAroundWrapper>
      )}
    </div>
  )
}
