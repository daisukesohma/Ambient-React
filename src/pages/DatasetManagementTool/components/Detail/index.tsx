import React from 'react'
import { includes, startCase } from 'lodash'

// src
import useStyles from './styles'

interface DetailProps {
  header: string
  data: string
  key: string
}

export default function Detail({
  key,
  header,
  data,
}: DetailProps): JSX.Element {
  const classes = useStyles()

  const getHeaderText = () => {
    if (includes(header, 'Url')) {
      return includes(header, 'presigned') ? 'Temporary URL' : 'Info URL'
    }
    return startCase(header)
  }
  const getDataText = () => {
    // checks if its a timestamp
    if (includes(header, 'timestamp')) {
      return new Date(data).toUTCString()
    }
    // checks if its a url
    if (includes(header, 'Url')) {
      return (
        <a className={classes.a} href={data} target='_blank' rel='noreferrer'>
          Link
        </a>
      )
    }
    // checks if its an annotation
    if (header === 'annotation') {
      return <div className={classes.annotations}>{JSON.stringify(data)}</div>
    }
    return data
  }

  return (
    <tr key={key}>
      <thead className={classes.detailHeader}>{getHeaderText()}:</thead>
      <td className={classes.data}>{getDataText()}</td>
    </tr>
  )
}
