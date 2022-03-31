import React from 'react'
import { CSVLink } from 'react-csv'
import { Icon } from 'react-icons-kit'
import { download } from 'react-icons-kit/feather/download'

import useStyles from './styles'

function CsvDownloadTemplate() {
  const classes = useStyles()
  const data = [['Name', 'IP', 'Port']]

  return (
    <CSVLink
      data={data}
      filename='ambient-streams-template.csv'
      className={classes.downloadLink}
    >
      <span>Download CSV Template</span>
      <span style={{ marginLeft: 16 }}>
        <Icon icon={download} size={14} />
      </span>
    </CSVLink>
  )
}

export default CsvDownloadTemplate
