import React, { useEffect, useState } from 'react'
import moment from 'moment'

// FUTURE: @Eric
// This has two responsibilities - set timer to increment as well as figure out
// the display format
// Ideally, separate this out into one to just get the raw data
// and another to get the format
// and another to display that time
//
// NowTime curently formats the string fully
//
const NowTime = () => {
  const initialNowTime = moment().format('LTS')
  const [readableNow, setReadableNow] = useState(initialNowTime)

  // set update now time every second
  useEffect(() => {
    let nowInterval = null
    nowInterval = setInterval(() => {
      const nowTime = moment().format('LTS')
      setReadableNow(nowTime)
    }, 1000)
    return () => clearInterval(nowInterval)
  }, [])

  return <>{readableNow}</>
}

export default NowTime
