import React, { useState, useMemo } from 'react'
import { DataTable, AlertLevelLabel } from 'ambient_ui'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import sampleSize from 'lodash/sampleSize'
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import map from 'lodash/map'
// src
import { funcs } from 'sagas/analytics/mockData'
import ExpansionPanel from './ExpansionPanel'
import TableHeader from './TableHeader'
import PercTimeUtilizedField from './PercTimeUtilizedField'
import NameWithSnapshot from './NameWithSnapshot'

export default function MeetingRoomsConcept() {
  const [panelRow, setPanelRow] = useState(null)

  const tableColumns = [
    {
      title: 'Room Name',
      field: 'room',
      render: row => (
        <NameWithSnapshot name={row.room} srcKey={row.snapshotKey} />
      ),
    },
    { title: 'Capacity', field: 'capacity' },
    { title: 'Avg. Occupancy when utilized', field: 'avgOccWhenUtilized' },
    {
      title: '% Time Utilized',
      field: 'percTimeUtilized',
      render: row => <PercTimeUtilizedField value={row.percTimeUtilized} />,
    },
    { title: 'Max. Occupancy', field: 'maxOcc' },
    { title: 'Live Occupancy', field: 'liveOcc' },
    {
      title: 'Scene Elements',
      field: 'sceneElements',
      render: row => (
        <Box flexDirection='row' display='flex'>
          {map(get(row, 'sceneElements'), (sceneElement, index) => (
            <Box m={0.05} key={index}>
              <AlertLevelLabel level='medium' label={sceneElement} />
            </Box>
          ))}
        </Box>
      ),
    },
  ]

  const data = useMemo(() => {
    const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4']
    return map(rooms, (room, index) => {
      return {
        room,
        capacity: funcs.random(15, 20, 1)[0],
        avgOccWhenUtilized: funcs.jitterize(
          funcs.random(4, 10, 1)[0],
          1,
          2,
          0.5,
        ),
        maxOcc: funcs.random(10, 15, 1)[0],
        liveOcc: funcs.random(4, 10, 1)[0],
        percTimeUtilized: funcs.random(50, 90, 1)[0],
        sceneElements: sampleSize(
          ['Plant', 'TV', 'Couch', 'Cabinet'],
          funcs.random(1, 4, 1)[0],
        ),
        snapshotKey: `room_${index + 1}`,
        heatmapKey: `room_${index + 1}`,
      }
    })
  }, [])

  return (
    <Paper>
      <DataTable
        title={
          <TableHeader
            title='Meeting Rooms Overview'
            building='SF Hooper'
            floor='3'
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
          const index = findIndex(data, d => d.room === row.room)
          setPanelRow(panelRow === index ? null : index)
        }}
      />
      <ExpansionPanel
        open={Boolean(panelRow !== null)}
        title={`Room Details: ${get(data[panelRow], 'room')}`}
        heatmapKey={get(data[panelRow], 'heatmapKey')}
        options={{
          occupancy: true,
          heatmap: true,
          utilization: true,
        }}
      />
    </Paper>
  )
}
