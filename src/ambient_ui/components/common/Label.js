import React from 'react'
import PropTypes from 'prop-types'
import { VictoryTooltip, VictoryLabel } from 'victory'

const Label = props => {
  return (
    <g>
      <VictoryLabel {...props} />
      <VictoryTooltip
        {...this.props}
        x={200}
        y={250}
        text={`${props.text}`}
        orientation="top"
        pointerLength={0}
        cornerRadius={50}
        width={100}
        height={100}
        flyoutStyle={{ fill: 'black' }}
      />
    </g>
  )
}

Label.defaultEvents = VictoryTooltip.defaultEvents
Label.propTypes = { text: PropTypes.string }

export default Label
