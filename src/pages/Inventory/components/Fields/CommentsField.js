import React from 'react'
import { CircularProgress } from 'ambient_ui'

const CommentsField = ({ rowData, darkMode }) => {
  const { node } = rowData

  return <div style={{ width: 300 }}>{node.comment}</div>
}

export default CommentsField
