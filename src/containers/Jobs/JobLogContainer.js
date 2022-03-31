import React from 'react'
import { useSelector } from 'react-redux'

import PageTitle from '../../components/Page/Title'

import JobLogTable from './components/JobLogTable'

export default function JobLogContainer() {
  const darkMode = useSelector(state => state.settings.darkMode)
  return (
    <div>
      <PageTitle title='Jobs' darkMode={darkMode} />
      <JobLogTable />
    </div>
  )
}
