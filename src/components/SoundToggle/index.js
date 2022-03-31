import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Icon } from 'react-icons-kit'
import { bell } from 'react-icons-kit/feather/bell'
import { bellOff } from 'react-icons-kit/feather/bellOff'
import clsx from 'clsx'
import { toggleIsSpeechMuted } from 'redux/slices/settings'
import Tooltip from 'components/Tooltip'
import { useCursorStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

function SoundToggle({ size }) {
  const speechIsMuted = useSelector(state => state.settings.speechIsMuted)
  const dispatch = useDispatch()
  const cursorStyles = useCursorStyles()
  const toggle = () => {
    dispatch(toggleIsSpeechMuted())
  }

  const styles = useStyles({ speechIsMuted })
  return (
    <div style={{ marginBottom: 8 }}>
      <Tooltip
        content={
          speechIsMuted ? 'Alerts Sounds are Muted' : 'Alerts Sounds are On'
        }
        placement='bottom-start'
        offset={[-50, 0]}
      >
        <div
          className={clsx(cursorStyles.pointer, styles.icon)}
          onClick={toggle}
        >
          <Icon icon={speechIsMuted ? bellOff : bell} size={size} />
        </div>
      </Tooltip>
    </div>
  )
}

SoundToggle.propTypes = {
  size: PropTypes.number,
}

SoundToggle.defaultProps = {
  size: 16,
}

export default SoundToggle
