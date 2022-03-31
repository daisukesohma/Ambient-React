import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { CSVReader } from 'react-papaparse'
import { Button } from 'ambient_ui'
import clsx from 'clsx'
import get from 'lodash/get'
import { useDispatch } from 'react-redux'
// src
import { createNotification } from 'redux/slices/notifications'

import useStyles from './styles'

const buttonRef = React.createRef()

export default function CsvUploadParseButtons({ setData }) {
  const theme = useTheme()
  const classes = useStyles()
  const dispatch = useDispatch()
  const [numberOfRows, setNumberOfRows] = useState(undefined)

  const countNumberOfRows = data => {
    if (data && data.length) {
      setNumberOfRows(data.length)
    } else {
      setNumberOfRows(undefined)
    }
  }

  const handleOnUpload = data => {
    if (data) {
      countNumberOfRows(data)
      const isValidated = validateHeader(data)
      if (isValidated) {
        setData(data)
      }
    }
  }

  const validateHeader = data => {
    const requiredHeaders = ['name', 'ip']
    // let optionalHeaders = ['port']
    const firstRow = get(data, '[0].data')
    if (firstRow) {
      const headers = Object.keys(firstRow)
      const hasRequired = requiredHeaders.map(header =>
        headers.includes(header),
      )
      // const hasOptional  = optionalHeaders.map(header => headers.includes(header))
      if (hasRequired.includes(false)) {
        dispatch(
          createNotification({
            message:
              'CSV file requires "Name" and "IP" fields as headers, it optionally takes "Port" ',
          }),
        )
        return false
      }
      return true
    }
    return false
  }

  const handleOpenDialog = e => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  const handleOnError = (err, file, inputElem, reason) => {
    dispatch(
      createNotification({
        message: `CSV Upload Error: ${err}. Reason:  ${reason}`,
      }),
    )
  }

  const handleOnRemoveFile = data => {
    countNumberOfRows(undefined)
    setData(undefined)
  }

  const handleRemoveFile = e => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e)
    }
  }

  return (
    <CSVReader
      config={{ header: true, transformHeader: header => header.toLowerCase() }}
      ref={buttonRef}
      onFileLoad={handleOnUpload}
      onError={handleOnError}
      noClick
      noDrag={false}
      progressBarColor={theme.palette.common.tertiary}
      onRemoveFile={handleOnRemoveFile}
    >
      {({ file }) => {
        return (
          <div className={classes.root}>
            {!file && (
              <Button
                variant='contained'
                color='primary'
                onClick={handleOpenDialog}
              >
                Upload Csv
              </Button>
            )}
            {file && (
              <div className={clsx('am-overline', classes.fileName)}>
                <div>{file && file.name}</div>
                <div className={clsx('am-overline', classes.numberRows)}>
                  {numberOfRows} records
                </div>
              </div>
            )}
            {file && (
              <div>
                <Button
                  variant='text'
                  color='primary'
                  onClick={handleRemoveFile}
                >
                  Remove CSV
                </Button>
              </div>
            )}
          </div>
        )
      }}
    </CSVReader>
  )
}

CsvUploadParseButtons.propTypes = {
  setData: PropTypes.func,
}

CsvUploadParseButtons.defaultProps = {
  setData: () => {},
}
