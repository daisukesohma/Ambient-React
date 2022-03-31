import React, { useState, useMemo } from 'react'
import map from 'lodash/map'
// src
import { DataTable } from 'ambient_ui'
import { funcs } from 'sagas/analytics/mockData'
import TableHeader from './TableHeader'

const BASE_FLOOR = 3

export default function BuildingsConcept() {
  const [floor, setFloor] = useState(BASE_FLOOR)

  const tableColumns = [
    { title: 'Space Category', field: 'space' },
    { title: 'Total Capacity', field: 'capacity' },
    { title: 'Avg. Occupancy', field: 'avgOcc' },
    { title: 'Max. Occupancy', field: 'maxOcc' },
    { title: 'Min. Occupancy', field: 'minOcc' },
    { title: 'Live Occupancy', field: 'liveOcc' },
  ]

  const data = useMemo(() => {
    const spaces = [
      'Workstations-Assigned',
      'Workstations-Flex',
      'Meeting Rooms',
      'Tertiary Spaces',
    ]
    return map(spaces, (space, index) => {
      return {
        space,
        floor,
        capacity:
          index < spaces.length - 1 ? funcs.random(15, 20, 1)[0] : 'N/A',
        avgOcc: funcs.jitterize(funcs.random(4, 10, 1)[0], 1, 2, 0.5),
        maxOcc: funcs.random(10, 15, 1)[0],
        minOcc: funcs.random(1, 4, 1)[0],
        liveOcc: funcs.random(4, 10, 1)[0],
      }
    })
  }, [floor])

  return (
    <DataTable
      title={
        <TableHeader
          title='Building Overview'
          building='SF Hooper'
          floor={floor}
          onFloorChange={() => {
            setFloor(BASE_FLOOR + ((floor - BASE_FLOOR + 1) % 2))
          }}
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
    />
  )
}
