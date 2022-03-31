import React from 'react'
import { get, isEmpty, map } from 'lodash'
import Popper from '@material-ui/core/Popper'
import Grid from '@material-ui/core/Grid'
import { isMobileOnly } from 'react-device-detect'

// src
import Detail from '../Detail'
import { DatasetType, DatasplitType } from '../../redux/dmsSlice'

import useStyles from './styles'

interface PopoverProps {
  children: JSX.Element
  open: boolean
  darkMode: boolean
  handleClose: () => void
  data: DatasetType | DatasplitType | undefined
  name: string | null
  count: number
  datasplitCount?: number | null
}

interface ClickType {
  currentTarget: Element
}

const defaultProps = {
  datasplitCount: null,
}

function DataDetails({
  name,
  children,
  open = false,
  darkMode = false,
  handleClose = () => {},
  data,
  count,
  datasplitCount = null,
}: PopoverProps): JSX.Element {
  const classes = useStyles({ darkMode, isMobileOnly })
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null)

  const handlingClose = () => {
    handleClose()
    setAnchorEl(null)
  }

  const handleClick = (event: ClickType) => {
    if (open) {
      handlingClose()
    } else {
      setAnchorEl(event.currentTarget)
    }
  }

  return (
    <div>
      <div
        // className={classes.label}
        role='button'
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            handleClick(e)
          }
        }}
      >
        {children}
      </div>
      <Popper
        open={open}
        anchorEl={anchorEl}
        modifiers={{
          offset: {
            enabled: true,
            offset: '-130, 8',
          },
        }}
      >
        <div className={classes.root} data-testid='popover'>
          <Grid container direction='column'>
            <table>
              {data &&
                map(Object.entries(data), (d: string[]) => {
                  if (d[0] === '__typename' || isEmpty(d[1])) {
                    return null
                  }
                  return (
                    <Detail
                      key={`${get(data, 'id')}${name}${d[0]}`}
                      header={d[0]}
                      data={d[1]}
                    />
                  )
                })}
              {datasplitCount && (
                <Detail
                  key={`${get(data, 'id')}${name}datasplits`}
                  header='Datasplits'
                  data={datasplitCount.toString()}
                />
              )}
              <Detail
                key={`${get(data, 'id')}${name}datapoints`}
                header='Datapoints'
                data={count.toString()}
              />
            </table>
          </Grid>
        </div>
      </Popper>
    </div>
  )
}

DataDetails.defaultProps = defaultProps

export default DataDetails
