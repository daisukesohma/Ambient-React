import { useEffect, useState } from 'react'

const useTimeFormat = (ts, format) => {
  const [hours, setHours] = useState(undefined)
  const [minutes, setMinutes] = useState(undefined)
  const [seconds, setSeconds] = useState(undefined)
  const [ampm, setAmpm] = useState(undefined)

  useEffect(() => {
    if (ts && ts.format) {
      if (format === '12h') {
        setHours(ts.format('h'))
        setAmpm(ts.format('A'))
      } else if (format === '24h') {
        setHours(ts.format('HH'))
        setAmpm(undefined)
      }
      // always set minutes and seconds
      setMinutes(ts.format('mm'))
      setSeconds(ts.format('ss'))
    }
  }, [format, ts])

  return {
    hours,
    minutes,
    seconds,
    ampm,
    string: `${hours}:${minutes}:${seconds}${ampm || ''}`,
  }
}

export default useTimeFormat
