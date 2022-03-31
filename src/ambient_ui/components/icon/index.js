import React from 'react'
import PropTypes from 'prop-types'

import SvgWrapper from '../icons/contents/SvgWrapper'
import { icons } from '../../shared/icons'

import './index.css'

/**
 * An Icon is a piece of visual element, but we must ensure its accessibility while using it.
 * It can have 2 purposes:
 *
 * - *decorative only*: for example, it illustrates a label next to it. We must ensure that it is ignored by screen readers, by setting `aria-hidden` attribute (ex: `<Icon icon="check" aria-hidden />`)
 * - *non-decorative*: it means that it delivers information. For example, an icon as only child in a button. The meaning can be obvious visually, but it must have a proper text alternative via `aria-label` for screen readers. (ex: `<Icon icon="print" aria-label="Print this document" />`)
 */
//
function Icon ({
  animate,
  color,
  fill,
  height,
  icon,
  fillOnlyIcon,
  pathProps,
  size,
  stroke,
  strokeWidth,
  width,
  ...props
}) {
  return (
    <SvgWrapper width={size || width} height={size || height} {...props}>
      {({ palette }) => {
        return (
          <>
            <path
              className={animate ? 'animate' : null}
              d={icons[icon]}
              stroke={stroke || color || palette.text.primary}
              fill={fill || color || palette.text.primary}
              strokeWidth={strokeWidth}
              strokeLinecap='round'
              strokeLinejoin='round'
              pathLength='1'
              {...pathProps}
            />
            {fillOnlyIcon && (
              <path
                d={icons[fillOnlyIcon]}
                fill={stroke || color}
                {...pathProps}
              />
            )}
          </>
        )
      }}
    </SvgWrapper>
  )
}

Icon.propTypes = {
  animate: PropTypes.bool,
  color: PropTypes.string,
  fill: PropTypes.string,
  fillOnlyIcon: PropTypes.string,
  height: PropTypes.number,
  icon: PropTypes.string.isRequired,
  pathProps: PropTypes.object,
  size: PropTypes.number,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  width: PropTypes.number,
}

Icon.defaultProps = {
  animate: false,
  color: null,
  fill: 'transparent',
  fillOnlyIcon: null,
  height: 24,
  pathProps: {},
  size: 24,
  stroke: null,
  strokeWidth: 2,
  width: 24,
}

export default Icon
