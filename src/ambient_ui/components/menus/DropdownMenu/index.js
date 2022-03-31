/*
 * author: rodaan@ambient.ai
 * Dropdown Menu
 * TODO: Make it look more like the Figma design
 */
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import get from 'lodash/get'
import clsx from 'clsx'

import '../../design_system/Theme.css'
import EnhancedMenu from '../EnhancedMenu'

import useStyles from './styles'

const DropdownMenu = ({
  classOverride,
  fitRow,
  selectedItem,
  handleSelection,
  menuItems,
  styles,
  disabled,
  labelWidth,
}) => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode, disabled, labelWidth, fitRow })

  const [anchorElement, setAnchorElement] = useState(null)

  const handleClick = event => {
    if (!disabled) {
      setAnchorElement(event.currentTarget)
    }
  }

  const handleMenuClose = () => {
    setAnchorElement(null)
  }

  const handleItemChange = item => {
    if (!disabled) {
      handleSelection(item)
      setAnchorElement(null)
    }
  }

  const getLabelValue = () => {
    if (!menuItems || (menuItems && menuItems.length === 0)) {
      return 'No items'
    }
    return get(selectedItem, 'label')
  }

  return (
    <form
      className={classOverride}
      autoComplete='off'
      onClick={e => e.stopPropagation()}
    >
      <FormControl
        className={clsx('am-dropdown-form-control', {
          [classes.formControlFit]: fitRow,
        })}
      >
        <div
          onClick={handleClick}
          className={clsx(classes.selectValue, {
            [classes.disabledColor]: disabled,
          })}
          style={styles}
        >
          <>
            <span
              className={clsx('am-subtitle2', classes.selectLabelValue, {
                [classes.labelWidth]: labelWidth,
                [classes.disabledColor]: disabled,
              })}
            >
              {getLabelValue()}
            </span>
            {!disabled &&
              (get(menuItems, 'length') > 0 && anchorElement ? (
                <ExpandLessIcon className={classes.icon} />
              ) : (
                <ExpandMoreIcon className={classes.icon} />
              ))}
          </>
        </div>
        {get(menuItems, 'length') > 0 && (
          <EnhancedMenu
            darkMode={darkMode}
            open={Boolean(anchorElement)}
            menuItems={menuItems}
            anchorElement={anchorElement}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={handleMenuClose}
            onItemClick={handleItemChange}
            selectedItem={selectedItem}
            disabled={disabled}
            width={labelWidth}
          />
        )}
      </FormControl>
    </form>
  )
}

DropdownMenu.defaultProps = {
  classOverride: null,
  fitRow: false,
  darkMode: false,
  selectedItem: null,
  handleSelection: () => {},
  menuItems: [{ value: 'default', label: 'default' }],
  disabled: false,
  labelWidth: null,
}

DropdownMenu.propTypes = {
  classOverride: PropTypes.string,
  fitRow: PropTypes.bool,
  darkMode: PropTypes.bool,
  selectedItem: PropTypes.object,
  handleSelection: PropTypes.func,
  menuItems: PropTypes.array,
  styles: PropTypes.object,
  disabled: PropTypes.bool,
  labelWidth: PropTypes.string,
}

export default DropdownMenu
