import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

// https://stackoverflow.com/questions/42296499/how-to-display-svg-icons-svg-files-in-ui-using-react-component
import touchSwipeSrc from '../../../../../../assets/vms/touchSwipe.svg' // https://www.flaticon.com/packs/touch-gestures-6
import KeyShortcutDisplay from '../../KeyShortcutDisplay'
import './index.css'

const SIZE = 20

const DragSpeedContent = ({ speed }) => {
  const slowClass = clsx('tooltip-info-block', { active: speed === 'SLOW' })
  const normalClass = clsx('tooltip-info-block', { active: speed === 'NORMAL' })
  const fastClass = clsx('tooltip-info-block', { active: speed === 'FAST' })

  return (
    <div style={styles.container}>
      <div className={slowClass}>
        <div style={styles.text}>1/2x</div>
        <div style={styles.container}>
          <KeyShortcutDisplay keyName='Alt' />
          <img
            alt='Hold alt to drag slower'
            src={touchSwipeSrc}
            height={SIZE}
            width={SIZE}
          />
        </div>
      </div>
      <div className={normalClass}>
        <img alt='Drag' src={touchSwipeSrc} height={SIZE} width={SIZE} />
      </div>
      <div className={fastClass}>
        <div style={styles.text}>2x</div>
        <div style={styles.container}>
          <KeyShortcutDisplay keyName='⌘' />
          <img
            alt='Hold command to drag faster'
            src={touchSwipeSrc}
            height={SIZE}
            width={SIZE}
          />
        </div>
      </div>
    </div>
  )
}

let styles = {
  container: { display: 'flex', flexDirection: 'row' },
  text: { color: 'white', fontSize: 12 },
}

DragSpeedContent.defaultProps = {
  speed: 'NORMAL',
}

DragSpeedContent.propTypes = {
  speed: PropTypes.oneOf(['SLOW', 'NORMAL', 'FAST']),
}

export default DragSpeedContent
