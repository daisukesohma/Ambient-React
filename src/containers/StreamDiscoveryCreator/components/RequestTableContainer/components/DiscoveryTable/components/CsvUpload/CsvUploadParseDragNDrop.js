import React from 'react'
import { CSVReader } from 'react-papaparse'

function CsvUploadParseDragNDrop() {
  const handleOnDrop = data => {}

  const handleOnError = (err, file, inputElem, reason) => {}

  const handleOnRemoveFile = data => {}
  return (
    <>
      <CSVReader
        onDrop={handleOnDrop}
        onError={handleOnError}
        addRemoveButton
        onRemoveFile={handleOnRemoveFile}
      >
        <span>Drop CSV file here or click to upload.</span>
      </CSVReader>
    </>
  )
}

export default CsvUploadParseDragNDrop
