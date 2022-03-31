import React from 'react'
import PropTypes from 'prop-types'
import { folderOpen } from 'react-icons-kit/fa/folderOpen'
import { folder as folderIcon } from 'react-icons-kit/fa/folder'
import { videoCamera } from 'react-icons-kit/fa/videoCamera'
import { Icon } from 'react-icons-kit'
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdChevronRight,
  MdKeyboardArrowDown,
  MdAddBox,
  MdIndeterminateCheckBox,
} from 'react-icons/md'

const defaultProps = {
  darkMode: false,
}

const propTypes = {
  darkMode: PropTypes.bool,
}

const icons = darkMode => {
  return {
    check: <MdCheckBox className='rct-icon rct-icon-check' />,
    uncheck: <MdCheckBoxOutlineBlank className='rct-icon rct-icon-uncheck' />,
    halfCheck: (
      <MdIndeterminateCheckBox className='rct-icon rct-icon-half-check' />
    ),
    expandClose: <MdChevronRight className='rct-icon rct-icon-expand-close' />,
    expandOpen: (
      <MdKeyboardArrowDown className='rct-icon rct-icon-expand-open' />
    ),
    expandAll: <MdAddBox className='rct-icon rct-icon-expand-all' />,
    collapseAll: (
      <MdIndeterminateCheckBox className='rct-icon rct-icon-collapse-all' />
    ),
    parentClose: (
      <Icon
        icon={folderIcon}
        style={{
          color: darkMode ? 'white' : '#43454A',
          marginRight: 16,
        }}
        size={18}
      />
    ),
    parentOpen: (
      <Icon
        icon={folderOpen}
        style={{
          color: darkMode ? 'white' : '#43454A',
          marginRight: 16,
        }}
        size={18}
      />
    ),
    leaf: (
      <Icon
        icon={videoCamera}
        style={{
          color: darkMode ? 'white' : '#43454A',
          marginRight: 16,
        }}
        size={18}
      />
    ),
  }
}

icons.propTypes = propTypes

icons.defaultProps = defaultProps

export default icons
