/*
  Gets the EvidenceInstance for an instance. It polls for the EvidenceInstance but uses jitter and exponential backoff to reduce Server load.
  Mandatory props:
    - variables --> object with variables for graphql query
    - query --> Graphql Query
  Optional props:
    - maxTries --> Integer - number of times to attemp to get EvidenceInstance (default is 30)
    - baseSleep --> Integer - base time to sleep (default is 500)
    - capSleep --> Integer - Largest amount to time possible to sleep for (default is 5000)

  author: Rodaan Peralta-Rabang rodaan@ambient.ai
*/
import React, { useEffect, useState, useCallback } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import LinearProgress from '@material-ui/core/LinearProgress'
import get from 'lodash/get'

import { getHost } from 'utils'

const EvidenceInstance = ({
  createdTs,
  variables,
  query,
  capSleep,
  maxTries,
  baseSleep,
  timeLimit,
  selected,
  uniqueKey,
  instance,
}) => {
  const [refreshInstance, { data }] = useLazyQuery(query, {
    variables,
  })
  const initClip = get(instance, 'clip', null)
  const [loaded, setLoaded] = useState(false)
  const [tries, setTries] = useState(0)
  const [clip, setClip] = useState(initClip)
  const [lastSleep, setLastSleep] = useState(50)

  const getSleepTime = useCallback(() => {
    // Uses Decorrelated jitter and exponential backoff to reduce load on server
    // Learn more: https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
    const min = Math.min(lastSleep * 2, baseSleep)
    const max = Math.max(lastSleep * 2, baseSleep)
    const newSleep = Math.min(capSleep, Math.random() * (max - min) + min)
    setLastSleep(newSleep)

    return newSleep
  }, [baseSleep, lastSleep, capSleep])

  useEffect(() => {
    if (!clip && data) {
      if (!data.clip) {
        if (tries < maxTries) {
          setTries(tries + 1)

          setTimeout(() => {
            refreshInstance()
          }, getSleepTime())
        } else {
          // console.log(`Could not fetch evidence. Exhausted ${maxTries} retries.`);
        }
      } else {
        // console.log(`Evidence fetched on Attempt ${tries}`);
        setClip(data.clip)
      }
    }
  }, [data, clip, getSleepTime, maxTries, refreshInstance, tries])

  useEffect(() => {
    const d = new Date().getTime()
    if (!clip && d - Number(createdTs) < timeLimit) {
      refreshInstance()
    } else {
      // console.log(`Could not fetch evidence. Alerts too old.`);
    }
  }, [clip, createdTs, refreshInstance, timeLimit])

  const srcUrl =
    clip && clip.indexOf('http') === -1 ? `${getHost()}${clip}` : clip

  const imgDisplay = clip ? (
    <div>
      {!loaded && selected && <LinearProgress />}
      {selected ? (
        <img
          src={srcUrl}
          className='evidence'
          style={{
            width: '100%',
            height: '100%',
            display: loaded ? 'inline' : 'none',
          }}
          alt='Evidence Clip'
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <div style={{ minHeight: '100px' }} />
      )}
      {!loaded && selected && <div style={{ minHeight: '100px' }} />}
    </div>
  ) : (
    <LinearProgress />
  )

  return (
    <div style={{ textAlign: 'center' }} key={uniqueKey}>
      <div className='col-lg-12'>{imgDisplay}</div>
    </div>
  )
}

EvidenceInstance.defaultProps = {
  baseSleep: 50,
  capSleep: 1000,
  createdTs: null,
  instance: null,
  maxTries: 30,
  selected: false,
  query: null,
  timeLimit: 86400 * 24,
  uniqueKey: null,
  variables: null,
}

EvidenceInstance.propTypes = {
  baseSleep: PropTypes.number,
  capSleep: PropTypes.number,
  createdTs: PropTypes.number,
  instance: PropTypes.object,
  maxTries: PropTypes.number,
  selected: PropTypes.bool,
  query: PropTypes.string,
  timeLimit: PropTypes.number,
  uniqueKey: PropTypes.string,
  variables: PropTypes.object,
}

export default EvidenceInstance
