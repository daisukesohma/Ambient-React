import React, { useState, useMemo } from 'react'
import { DataTable, AlertLevelLabel } from 'ambient_ui'
import Box from '@material-ui/core/Box'
import sampleSize from 'lodash/sampleSize'
import sample from 'lodash/sample'
import Moment from 'react-moment'
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import map from 'lodash/map'
import Paper from '@material-ui/core/Paper'
// src
import { funcs } from 'sagas/analytics/mockData'
import ExpansionPanel from './ExpansionPanel'
import TableHeader from './TableHeader'
import PercTimeUtilizedField from './PercTimeUtilizedField'
import NameWithSnapshot from './NameWithSnapshot'
import { msToUnix } from '../../../../../../utils'

export default function WorkstationsConcept() {
  const [panelRow, setPanelRow] = useState(null)

  const tableColumns = [
    {
      title: 'Workstation',
      field: 'workstation',
      render: row => (
        <NameWithSnapshot name={row.workstation} srcKey={row.snapshotKey} />
      ),
    },
    { title: 'Type', field: 'type' },
    {
      title: '% Time Utilized',
      field: 'percTimeUtilized',
      render: row => <PercTimeUtilizedField value={row.percTimeUtilized} />,
    },
    { title: 'Live Occupancy', field: 'liveOcc' },
    {
      title: 'Last Utilized',
      field: 'lastUtilized',
      render: row => {
        if (row.liveOcc === 0) {
          return (
            <Moment unix format='MMM Do, h:mm a'>
              {row.lastUtilized}
            </Moment>
          )
        }
        return 'N/A'
      },
    },
    {
      title: 'Environmental Factors',
      field: 'factors',
      render: row => (
        <Box flexDirection='row' display='flex'>
          {map(get(row, 'factors'), (factor, index) => (
            <Box m={0.5} key={index}>
              <AlertLevelLabel level='medium' label={factor} />
            </Box>
          ))}
        </Box>
      ),
    },
  ]

  const data = useMemo(() => {
    const workstations = ['Desk 1', 'Desk 2', 'Desk 3', 'Desk 4']
    const factors = ['Windows', 'Near breakroom']
    const now = msToUnix(Date.now())
    return map(workstations, (workstation, index) => ({
      workstation,
      type: sample(['Flex', 'Assigned']),
      percTimeUtilized: funcs.random(50, 90, 1)[0],
      liveOcc: funcs.random(0, 2, 1)[0],
      factors: sampleSize(factors, funcs.random(1, factors.length, 1)[0]),
      snapshotKey: `workstation_${index + 1}`,
      heatmapKey: 'workstation',
      lastUtilized: funcs.random(now - 6 * 3600, now, 1)[0],
    }))
  }, [])

  return (
    <Paper>
      <DataTable
        title={
          <TableHeader
            title='Workstations Overview'
            building='SF Hooper'
            floor={3}
            live={data.reduce((total, d) => total + d.liveOcc, 0)}
          />
        }
        columns={tableColumns}
        data={data}
        options={{
          search: true,
          sorting: true,
          padding: 'dense',
        }}
        onRowClick={(event, row) => {
          const index = findIndex(data, d => d.workstation === row.workstation)
          setPanelRow(panelRow === index ? null : index)
        }}
      />
      <ExpansionPanel
        open={Boolean(panelRow !== null)}
        heatmapKey={get(data[panelRow], 'heatmapKey')}
        title={`Workstation Details: ${get(data[panelRow], 'workstation')}`}
        options={{
          occupancy: true,
          heatmap: true,
          utilization: false,
        }}
      />
    </Paper>
  )
}
