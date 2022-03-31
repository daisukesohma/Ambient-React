import React, { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FilterListIcon from '@material-ui/icons/FilterList'
import { motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'

import { SearchBar, Button } from '../index'

const useStyles = makeStyles(({ palette }) => ({
  container: {
    maxWidth: 400,
    border: `1px solid ${palette.grey[300]}`,
    position: 'relative',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 10,
    '& >div': {
      width: '100%',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 300,
    overflowY: 'auto',
    borderTop: `1px solid ${palette.grey[300]}`,
    borderBottom: `1px solid ${palette.grey[300]}`,
    padding: '0 10px',
  },
  controllerContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 10,
  },
  noOption: {
    textAlign: 'center',
    padding: 50,
  },
  label: {
    color: palette.grey[700],
    fontSize: 14,
  },
  alert: {
    backgroundColor: palette.grey[100],
    color: palette.grey[700],
    borderRadius: '4px',
    padding: '5px 10px',
    fontSize: 16,
    height: 32,
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    color: palette.grey[500],
    width: 25,
    height: 25,
    marginRight: 10,
  },
  dynamicContainer: {
    left: -1,
    right: -1,
    border: `1px solid ${palette.grey[300]}`,
    borderTop: 'none',
    zIndex: 1,
    transformOrigin: ({ dropdownDirection }) =>
      dropdownDirection === 'top' ? 'bottom' : 'top',
  },
  closeBtn: {
    position: 'absolute',
    width: '30px !important',
    height: 42,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    right: 10,
    top: 10,
    zIndex: 10,
  },
}))

const SmartFilter = ({
  options,
  label,
  selectAll,
  onApply,
  customBackground,
  isStatic,
  isCloseShown,
  initialSelected,
  dropdownDirection,
  prefixLabel,
  fuseSearch,
  isTotalVisible,
  suffixLabel,
}) => {
  const classes = useStyles({ dropdownDirection, isStatic })

  const [selected, setSelected] = useState([])
  const [selectedCopy, setSelectedCopy] = useState([])
  const [displayOptions, setDisplayOptions] = useState(options)
  const [isOptionsShown, setIsOptionsShown] = useState(false)

  const wrapperRef = useRef(null)
  const handleClickOutside = useCallback(
    event => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOptionsShown(false)
        setDisplayOptions(options)
      }
    },
    [options],
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    if (options && options.length > 0) {
      setDisplayOptions(options)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [options, handleClickOutside])

  useEffect(() => {
    let initSelected = []
    if (selectAll) {
      initSelected = options.slice(0)
    } else if (initialSelected) {
      initSelected = initialSelected
    }
    setSelected(initSelected.slice(0))
    setIsOptionsShown(false)
  }, [initialSelected, selectAll, options])

  useEffect(() => {
    setSelectedCopy(selected)
  }, [selected])

  const getIndex = (option, arr) => {
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i].value === option.value) {
        return i
      }
    }
    return -1
  }

  const handleSelect = option => () => {
    const selectedTemp = selectedCopy.slice(0)
    // const index = selectedCopy.indexOf(option);
    const index = getIndex(option, selectedCopy)
    if (index === -1) {
      selectedTemp.push(option)
    } else {
      selectedTemp.splice(index, 1)
    }
    setSelectedCopy(selectedTemp)
  }

  const handleSelectAll = () => {
    if (options.length === selectedCopy.length) {
      setSelectedCopy([])
    } else {
      setSelectedCopy([...options])
    }
  }

  const handleChange = searchStr => {
    if (!searchStr) {
      setDisplayOptions(options)
      return
    }
    let newOptions = []

    if (fuseSearch) {
      const { options: fuseOptions, objects, labelKey, valueKey } = fuseSearch
      const inputChunks = searchStr.split(' ')

      const queries = []
      fuseOptions.keys.forEach(key => {
        const queriesForKey = []
        inputChunks.forEach(chunk => {
          const query = {
            [key]: chunk,
          }
          queriesForKey.push(query)
        })
        queries.push({
          $or: queriesForKey,
        })
      })

      const finalQuery = {
        $or: queries,
      }

      const fuse = new Fuse(objects, fuseOptions)
      const results = fuse.search(finalQuery)
      newOptions = results.map(({ item }) => ({
        value: item[valueKey],
        label: item[labelKey],
      }))
    } else {
      options.forEach(option => {
        if (
          option.label.toLowerCase().indexOf(searchStr.toLowerCase()) !== -1
        ) {
          newOptions.push(option)
        }
      })
    }
    setDisplayOptions(newOptions)
  }

  const clearSelected = () => {
    setSelected([])
  }

  const apply = () => {
    setIsOptionsShown(false)
    setDisplayOptions(options)
    setSelected(selectedCopy)
    onApply(selectedCopy)
  }

  const handleFocus = () => {
    setIsOptionsShown(true)
    setSelectedCopy(selected)
  }

  const handleCloseBtn = () => {
    setIsOptionsShown(false)
    setDisplayOptions(options)
  }

  const closeBtnShown = isOptionsShown && isCloseShown

  return (
    <div
      ref={wrapperRef}
      className={classes.container}
      style={{ backgroundColor: customBackground }}
    >
      {closeBtnShown && (
        <div className={classes.closeBtn} onClick={handleCloseBtn}>
          {/* <Close /> */}
        </div>
      )}
      {dropdownDirection === 'bottom' && (
        <div
          className={classes.searchContainer}
          tabIndex='1'
          onFocus={handleFocus}
        >
          {isOptionsShown ? (
            <SearchBar onChange={handleChange} />
          ) : (
            <div
              className={classes.alert}
              style={
                customBackground ? { backgroundColor: customBackground } : {}
              }
            >
              <FilterListIcon className={classes.icon} />
              {`${prefixLabel}${
                isTotalVisible
                  ? `${selected.length} of ${options.length}`
                  : selected.length
              } ${label} ${suffixLabel || 'Applied'}`}
            </div>
          )}
        </div>
      )}
      <AnimatePresence>
        {isOptionsShown && (
          <motion.div
            className={classes.dynamicContainer}
            style={{
              backgroundColor: customBackground,
              position: !isStatic ? 'absolute' : 'static',
              bottom: !isStatic && dropdownDirection === 'top' ? 62 : 'unset',
            }}
            initial={{
              transform: 'scaleY(0%)',
            }}
            animate={{
              transform: 'scaleY(1)',
              transition: { duration: 0.1 },
            }}
            exit={{
              transform: 'scaleY(0)',
              transition: { duration: 0.1 },
            }}
          >
            <div className={classes.optionsContainer}>
              {displayOptions.length === 0 ? (
                <div className={classes.noOption}>No Options!</div>
              ) : (
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={options.length === selectedCopy.length}
                        onChange={handleSelectAll}
                      />
                    }
                    label='Select All'
                    key='all'
                    classes={{ label: classes.label }}
                  />
                  {displayOptions.map((option, key) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={getIndex(option, selectedCopy) !== -1}
                          onChange={handleSelect(option)}
                          value={option.value}
                        />
                      }
                      label={option.label}
                      key={key}
                      classes={{ label: classes.label }}
                    />
                  ))}
                </FormGroup>
              )}
            </div>
            <div className={classes.controllerContainer}>
              <div className={classes.button}>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={clearSelected}
                >
                  Clear
                </Button>
              </div>
              <div className={classes.button}>
                <Button variant='contained' color='primary' onClick={apply}>
                  Apply
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {dropdownDirection === 'top' && (
        <div
          className={classes.searchContainer}
          tabIndex='1'
          onFocus={handleFocus}
        >
          {isOptionsShown ? (
            <SearchBar onChange={handleChange} />
          ) : (
            <div
              className={classes.alert}
              style={
                customBackground ? { backgroundColor: customBackground } : {}
              }
            >
              <FilterListIcon className={classes.icon} />
              {`${selected.length} ${label} Applied`}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

SmartFilter.defaultProps = {
  options: [],
  label: 'Filters',
  selectAll: false,
  customBackground: undefined,
  onApply: () => {},
  isStatic: false,
  isCloseShown: false,
  initialSelected: [],
  dropdownDirection: 'bottom',
  prefixLabel: '',
  fuseSearch: null,
  isTotalVisible: false,
  suffixLabel: '',
}

SmartFilter.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.string,
  selectAll: PropTypes.bool,
  customBackground: PropTypes.string,
  onApply: PropTypes.func,
  isStatic: PropTypes.bool,
  isCloseShown: PropTypes.bool,
  initialSelected: PropTypes.arrayOf(PropTypes.object).isRequired,
  dropdownDirection: PropTypes.string,
  prefixLabel: PropTypes.string,
  fuseSearch: PropTypes.object,
  isTotalVisible: PropTypes.bool,
  suffixLabel: PropTypes.string,
}

export default SmartFilter
