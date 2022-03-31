import React, { useState, useMemo } from 'react'
import { DataTable } from 'ambient_ui'
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

export default function TertiarySpacesConcept() {
  const [panelRow, setPanelRow] = useState(null)
  // This is a very specific request: Heatmap for 1 tertiary space
  // switches between two images. So we need to keep track of which one
  // is currently being displayed
  const [currentHeatmapIndex, setCurrentHeatmapIndex] = useState(0)

  const tableColumns = [
    {
      title: 'Space',
      field: 'space',
      render: row => (
        <NameWithSnapshot name={row.space} srcKey={row.snapshotKey} />
      ),
    },
    { title: 'Avg. Occupancy when utilized', field: 'avgOccWhenUtilized' },
    {
      title: '% Time Utilized',
      field: 'percTimeUtilized',
      render: row => <PercTimeUtilizedField value={row.percTimeUtilized} />,
    },
    { title: 'Max. Occupancy', field: 'maxOcc' },
    { title: 'Live Occupancy', field: 'liveOcc' },
  ]

  const data = useMemo(() => {
    const spaces = ['Space 1', 'Space 2', 'Space 3', 'Space 4', 'Space 5']
    return map(spaces, (space, index) => {
      return {
        space,
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
        snapshotKey: `tertiary_${index + 1}`,
        heatmapKey: index < 4 ? `tertiary_${index + 1}` : null,
        currentHeatmapIndex,
      }
    })
  }, [currentHeatmapIndex])

  return (
    <Paper>
      <DataTable
        title={
          <TableHeader
            title='Tertiary Spaces Overview'
            building='SF Hooper'
            floor='3'
            live={data.reduce((total, d) => total + d.liveOcc, 0)}
            onTimeChange={() => {
              setCurrentHeatmapIndex((currentHeatmapIndex + 1) % 2)
            }}
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
          const index = findIndex(data, d => d.space === row.space)
          setPanelRow(panelRow === index ? null : index)
        }}
      />
      <ExpansionPanel
        open={Boolean(panelRow !== null)}
        heatmapKey={
          get(data[panelRow], 'heatmapKey') ||
          `tertiary_5_${currentHeatmapIndex + 1}`
        }
        title={`Space Details: ${get(data[panelRow], 'space')}`}
        options={{
          occupancy: true,
          heatmap: true,
          utilization: false,
        }}
      />
    </Paper>
  )
}
