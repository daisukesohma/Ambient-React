import { StylesConfig } from 'react-select'
// TODO: should be used inside of component with useTheme hook OR ideally in makeStyles
import { light as palette } from 'theme'

import { SiteOption } from './types'

interface CustomProps {
  darkMode: boolean
  customBackgroundColor?: string | undefined
}

interface OptionProps {
  isDisabled: boolean
  isFocused: boolean
  isSelected: boolean
}

const optionBackgroundColor = ({
  darkMode,
  isDisabled,
  isFocused,
  isSelected,
}: OptionProps & CustomProps) => {
  if (isDisabled) {
    return 'inherit'
  }

  if (isSelected) {
    return darkMode ? palette.grey[800] : palette.grey[50]
  }

  if (isFocused) {
    return darkMode ? palette.grey[800] : palette.grey[50]
  }

  if (darkMode) {
    return palette.grey[900]
  }
  return palette.common.white
}

const controlBackgroundColor = ({
  darkMode,
  customBackgroundColor,
}: CustomProps) => {
  if (customBackgroundColor) {
    return customBackgroundColor
  }
  if (darkMode) {
    return palette.grey[800]
  }
  return palette.grey[50]
}

export default function customStyles({
  darkMode = false,
  customBackgroundColor = undefined,
}: CustomProps): StylesConfig<SiteOption, boolean> {
  return {
    control: styles => ({
      ...styles,
      backgroundColor: controlBackgroundColor({
        darkMode,
        customBackgroundColor,
      }),
      borderRadius: 4,
      border: 'none',
      boxShadow: 'none',
      padding: '4px 8px',
      '&:hover': {
        border: 'none',
        boxShadow: 'none',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: styles => ({
      ...styles,
      padding: 4,
      height: 32,
    }),
    dropdownIndicator: (styles, { selectProps }) => ({
      ...styles,
      transform: selectProps.menuIsOpen ? 'rotate(180deg)' : 'inherit',
    }),
    menu: styles => ({
      ...styles,
      boxShadow: 'none',
      borderRadius: 0,
      margin: 0,
      zIndex: 2000,
    }),
    menuList: styles => ({
      ...styles,
      padding: 0,
      zIndex: 2000,
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: optionBackgroundColor({
        darkMode,
        isDisabled,
        isFocused,
        isSelected,
      }),
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: isSelected || isFocused ? 900 : 300,
      fontSize: 14,
      color: darkMode ? palette.grey[100] : palette.grey[700],
      cursor: isDisabled ? 'not-allowed' : 'default',
      borderTop: `1px solid ${
        darkMode ? palette.grey[700] : palette.grey[100]
      }`,
      borderBottom: `1px solid ${
        darkMode ? palette.grey[700] : palette.grey[100]
      }`,
      padding: '10px 16px',
      '&:last-child': {
        borderBottom: `2px solid ${
          darkMode ? palette.grey[700] : palette.grey[100]
        }`,
      },
      '&:first-of-type': {
        borderTop: `2px solid ${
          darkMode ? palette.grey[700] : palette.grey[100]
        }`,
      },
      ':active': {
        ...styles[':active'],
        backgroundColor: darkMode ? palette.grey[800] : palette.grey[50],
      },
    }),
    input: styles => ({
      ...styles,
      fontSize: 14,
      fontWeight: 900,
      color: darkMode ? palette.grey[100] : palette.grey[700],
    }),
    placeholder: styles => ({
      ...styles,
      fontSize: 14,
      fontWeight: 900,
      color: darkMode ? palette.grey[100] : palette.grey[700],
    }),
    singleValue: styles => ({
      ...styles,
      fontSize: 14,
      fontWeight: 900,
      width: '100%',
      color: darkMode ? palette.grey[100] : palette.grey[700],
    }),
    noOptionsMessage: styles => ({
      ...styles,
      backgroundColor: darkMode ? palette.grey[800] : palette.grey[50],
      color: darkMode ? palette.grey[100] : palette.grey[700],
    }),
    valueContainer: provided => ({
      ...provided,
      minWidth: 100,
      cursor: 'pointer',
      padding: '0 8px',
    }),
  }
}
