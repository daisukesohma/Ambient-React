import React from 'react'
import PropTypes from 'prop-types'
import {Button} from 'ambient_ui'

const InfoPanel = props => (
  <div
    style={{
      padding: '10px 21px',
      borderTop: '1px solid #dce0e0',
      color: '#484848',
    }}
  >
    <div
      className="datepicker-buttons"
      style={{ display: 'flex', justifyContent: 'flex-end' }}
    >
      <Button
        onClick={props.onCancel}
        variant='text'
      >
        Cancel
      </Button>
      <Button
        onClick={props.onConfirmChange}
      >
        Confirm
      </Button>
    </div>
  </div>
)

InfoPanel.defaultProps = {
  onCancel: () => {},
  onConfirmChange: () => {},
}

InfoPanel.propTypes = {
  onCancel: PropTypes.func,
  onConfirmChange: PropTypes.func,
}

export default InfoPanel
