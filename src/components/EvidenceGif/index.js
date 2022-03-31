/*
  Gets the EvidenceGif for an alertInstance. It polls for the EvidenceGif but uses jitter and exponential backoff to reduce Server load.
  Mandatory props:
    - id,
      alert_hash,
      alertHash,
      clip,
      tsIdentifier,
      ts_identifier, --> AlertInstance object
  Optional props:
    - maxTries --> Integer - number of times to attemp to get EvidenceGif (default is 30)
    - baseSleep --> Integer - base time to sleep (default is 500)
    - capSleep --> Integer - Largest amount to time possible to sleep for (default is 5000)

  author: Rodaan Peralta-Rabang rodaan@ambient.ai
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import { withApollo } from 'react-apollo'
// src
import { hexRgba, getHost } from 'utils'
import isEmpty from 'lodash/isEmpty'

import { GET_ALERT_INSTANCE_BY_HASH } from './gql'

const propTypes = {
  uniqueKey: PropTypes.string,
  maxTries: PropTypes.number,
  baseSleep: PropTypes.number,
  capSleep: PropTypes.number,
  timeLimit: PropTypes.number,
  selected: PropTypes.bool,
  client: PropTypes.object,
}

const defaultProps = {
  uniqueKey: null,
  maxTries: 30,
  baseSleep: 50,
  capSleep: 1000,
  timeLimit: 86400 * 24,
  selected: false,
}

const AmbientLinearProgressDark = withStyles(({ palette }) => ({
  root: {
    height: '.24px !important',
  },
  colorPrimary: {
    background: palette.grey[900],
  },
  barColorPrimary: {
    background: `${hexRgba(palette.grey[800], 0.8)}`,
  },
}))(LinearProgress)

class EvidenceGif extends Component {
  constructor(props) {
    super(props)

    const {
      id,
      alert_hash,
      alertHash,
      eventHash,
      clip,
      tsIdentifier,
      ts_identifier,
      tsCreated,

      maxTries,
      baseSleep,
      capSleep,
      timeLimit,
    } = this.props

    this.state = {
      id,
      alert_hash,
      alertHash,
      eventHash,
      clip,
      tsIdentifier,
      ts_identifier,
      tsCreated,

      tries: 0,
      loaded: false,
    }

    this.lastSleep = 50

    this.EVIDENCE_MAX_TRIES = maxTries
    this.EVIDENCE_SLEEP_MS = baseSleep
    this.EVIDENCE_CAP_MS = capSleep
    this.TIME_LIMIT = timeLimit

    this.refreshAlertInstance = this.refreshAlertInstance.bind(this)
    this.updateAlertInstance = this.updateAlertInstance.bind(this)
    this.getSleepTime = this.getSleepTime.bind(this)
  }

  componentDidMount() {
    const { clip, tsIdentifier, ts_identifier, tsCreated } = this.state
    const d = new Date().getTime()
    const createdTs = tsIdentifier || ts_identifier || tsCreated // eslint-disable-line
    if (isEmpty(clip) && d - Number(createdTs) < this.TIME_LIMIT) {
      this.refreshAlertInstance()
    }
  }

  getSleepTime() {
    // Uses Decorrelated jitter and exponential backoff to reduce load on server
    // Learn more: https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
    const min = Math.min(this.lastSleep * 2, this.EVIDENCE_SLEEP_MS)
    const max = Math.max(this.lastSleep * 2, this.EVIDENCE_SLEEP_MS)
    const newSleep = Math.min(
      this.EVIDENCE_CAP_MS,
      Math.random() * (max - min) + min,
    )
    this.lastSleep = newSleep
    return newSleep
  }

  updateAlertInstance({
    id,
    alert_hash,
    alertHash,
    eventHash,
    clip,
    tsIdentifier,
    tsCreated,
    ts_identifier,
  }) {
    const { tries } = this.state
    if (isEmpty(clip)) {
      if (tries < this.EVIDENCE_MAX_TRIES) {
        const updatedTries = tries + 1
        this.setState({ tries: updatedTries }, () => {
          const sleepTime = this.getSleepTime()

          setTimeout(() => {
            this.refreshAlertInstance()
          }, sleepTime)
        })
      }
    } else {
      // console.log(`Evidence fetched on Attempt ${tries}`);
      this.setState({
        id,
        alert_hash,
        alertHash,
        eventHash,
        clip,
        tsIdentifier,
        tsCreated,
        ts_identifier,
      })
    }
  }

  refreshAlertInstance() {
    const { id, alert_hash, alertHash, eventHash } = this.state
    const { client } = this.props
    // TODO: for all websocket requests, convert them to camel case before propagating them down to application
    const hash = alertHash || alert_hash || eventHash // eslint-disable-line
    client
      .query({
        query: GET_ALERT_INSTANCE_BY_HASH,
        variables: {
          alertInstanceId: id,
          alertInstanceHash: hash,
        },
      })
      .then(response => {
        this.updateAlertInstance(response.data.alertInstanceByHash)
      })
  }

  render() {
    const { full_clip_url, clip, loaded } = this.state
    const { uniqueKey, selected } = this.props
    const resolvedClip = full_clip_url || clip
    const srcUrl =
      resolvedClip && resolvedClip.indexOf('http') === -1
        ? `${getHost()}${resolvedClip}`
        : resolvedClip

    const imgDisplay = resolvedClip ? (
      <div>
        {!loaded && selected && <AmbientLinearProgressDark />}
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
            onLoad={() => this.setState({ loaded: true })}
          />
        ) : (
          <div style={{ minHeight: '100px' }} />
        )}
        {!loaded && selected && <div style={{ minHeight: '100px' }} />}
      </div>
    ) : (
      <AmbientLinearProgressDark />
    )

    return (
      <div style={{ textAlign: 'center' }} key={uniqueKey}>
        <div className='col-lg-12'>{imgDisplay}</div>
      </div>
    )
  }
}

EvidenceGif.propTypes = propTypes
EvidenceGif.defaultProps = defaultProps

export default withApollo(EvidenceGif)
