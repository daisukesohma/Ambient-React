// TODO ts ignore for Button. Button has errors without it. need to convert it to ts.

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/require-default-props */
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
// src
import { Grid, TextField, Typography } from '@material-ui/core'
import {
  Button,
  // DateTimeRangePickerWithPopover,
  SearchableSelectDropdown,
} from 'ambient_ui'
import { fetchAccountsRequested } from 'features/Internal/redux/internalSlice'

import {
  closeModal,
  requestSupportAccessRequested,
} from '../../../redux/internalSlice'

import { useStyles } from './styles'

interface Props {
  account?: string | null
  nonModal?: boolean
  onRequestClick?: () => void
}

interface SiteOption {
  label: any
  value: any
}

// const getInitialDate = () => {
//   const startDate = new Date()
//   startDate.setMinutes(startDate.getMinutes() + 5)
//   const tempDate = new Date(startDate)
//   tempDate.setHours(tempDate.getHours() + 1)
//   const endDate = new Date(tempDate)
//   return [startDate.getTime() / 1000, endDate.getTime() / 1000] // save unix timestamp
// }

const HOUR = 3600

const timeOptions: SiteOption[] = [
  {
    label: '1 Hour',
    value: HOUR.toString(),
  },
  {
    label: '4 Hours',
    value: (HOUR * 4).toString(),
  },
  {
    label: '6 Hours',
    value: (HOUR * 6).toString(),
  },
  {
    label: '12 Hours',
    value: (HOUR * 12).toString(),
  },
  {
    label: '24 Hours',
    value: (HOUR * 24).toString(),
  },
]

export default function RequestSupportAccessModal({
  account = null,
  nonModal = false,
  onRequestClick = () => {},
}: Props): JSX.Element {
  const dispatch = useDispatch()
  const darkMode = useSelector((state: any) => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const [reason, setReason] = useState<string | null>(null)
  const requestLoading = useSelector(
    (state: any) => state.internal.requestLoading,
  )

  // const [startTs, setStartTs] = useState<number>(getInitialDate()[0])
  // const [endTs, setEndTs] = useState<number>(getInitialDate()[1])

  const [time, setTime] = useState<string>((HOUR * 6).toString())

  const [selectedAccount, setAccount] = useState<string | null>(null)
  const accounts = useSelector((state: any) => state.internal.accounts)

  useEffect(() => {
    dispatch(fetchAccountsRequested({}))
  }, [dispatch])

  // const onChangeDatePicker = (dateRange: number[]) => {
  //   setStartTs(dateRange[0])
  //   setEndTs(dateRange[1])
  // }

  const processedAccounts = map(accounts, a => {
    return {
      label: a.slug,
      value: a.slug,
    }
  })

  const onConfirm = () => {
    const startTime = new Date().getTime() / 1000
    const endTime = startTime + parseInt(time, 10)
    dispatch(
      requestSupportAccessRequested({
        input: {
          accountSlug: selectedAccount,
          reason,
          tsStartRequested: startTime,
          tsEndRequested: endTime,
        },
      }),
    )
    onRequestClick()
  }

  const onCancel = () => {
    dispatch(closeModal())
  }

  // const validTime =
  //   (endTs - startTs) / 3600 <= 24 && (endTs - startTs) / 3600 >= 1

  // const invalidTimeString = () => {
  //   const beginning = 'Invalid Time:'
  //   if ((endTs - startTs) / 3600 > 24) {
  //     return `${beginning} Time range must be a maximum of 24 hours`
  //   }
  //   return `${beginning} Time range must be a minimum of 1 hour`
  // }

  const proppedAccount = processedAccounts.find(
    (a: SiteOption) => account === a.value,
  )

  useEffect(() => {
    if (proppedAccount) {
      setAccount(account)
    }
  }, [proppedAccount, account])

  return (
    <div
      className={clsx({
        [classes.root]: !nonModal,
        [classes.nonModal]: nonModal,
      })}
    >
      <Grid>
        <Typography className={clsx(classes.title)}>
          Request Support Access
        </Typography>
      </Grid>
      <Grid
        container
        spacing={2}
        direction='column'
        justify='flex-start'
        alignItems='stretch'
        className={classes.content}
      >
        <Grid
          item
          container
          direction='row'
          justify='flex-start'
          alignItems='baseline'
        >
          <Typography>Account:</Typography>
          <Typography className={classes.required}>*</Typography>
        </Grid>
        <Grid item>
          {proppedAccount ? (
            <Typography>{account}</Typography>
          ) : (
            <SearchableSelectDropdown
              placeholder='Select Account'
              options={processedAccounts}
              onChange={(e: any) => {
                setAccount(e.value)
              }}
              value={
                processedAccounts.find(
                  (a: SiteOption) => selectedAccount === a.value,
                )!
              }
            />
          )}
        </Grid>
        <Grid
          item
          container
          direction='row'
          justify='flex-start'
          alignItems='baseline'
        >
          <Typography>Time:</Typography>
          <Typography className={classes.required}>*</Typography>
        </Grid>
        <Grid item>
          <SearchableSelectDropdown
            options={timeOptions}
            onChange={(option: any) => setTime(option.value)}
            value={timeOptions.find((t: any) => t.value === time)!}
          />
          {/* <DateTimeRangePickerWithPopover
            onChange={onChangeDatePicker}
            startTs={startTs}
            endTs={endTs}
            darkMode={darkMode}
          /> */}
        </Grid>
        <Grid
          item
          container
          direction='row'
          justify='flex-start'
          alignItems='baseline'
        >
          <Typography>Reason:</Typography>
          <Typography className={classes.required}>*</Typography>
        </Grid>
        <Grid item>
          <TextField
            variant='outlined'
            placeholder='Reason'
            value={reason}
            multiline
            fullWidth
            rows={10}
            onChange={e => {
              if (isEmpty(e.target.value)) {
                setReason(null)
              } else {
                setReason(e.target.value)
              }
            }}
            InputProps={{
              classes: {
                root: classes.textField,
                notchedOutline: classes.notchedOutline,
                colorSecondary: classes.textField,
                focused: classes.focused,
              },
            }}
          />
        </Grid>

        {/* {!validTime && (
          <Grid
            item
            container
            direction='row'
            justify='flex-start'
            alignItems='baseline'
          >
            <Typography className={classes.required}>
              {invalidTimeString()}
            </Typography>
          </Grid>
        )} */}

        <Grid
          item
          container
          direction='row'
          justify={nonModal ? 'flex-end' : 'space-between'}
          alignItems='flex-start'
        >
          {!nonModal && (
            <Button
              variant='outlined'
              onClick={onCancel}
              disabled={requestLoading}
            >
              Cancel
            </Button>
          )}

          <Button
            onClick={onConfirm}
            disabled={!selectedAccount || !reason || requestLoading || !time}
            loading={requestLoading}
          >
            Confirm
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
