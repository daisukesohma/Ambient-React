/*
 * Figma _components / checklist
 */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import findIndex from 'lodash/findIndex'
import clsx from 'clsx'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'

import useStyles from './styles'

export default function CheckboxList({
  items,
  placeholder,
  onSelect,
  selected,
  classOverride,
}) {
  const classes = useStyles()
  const [checked, setChecked] = useState([...selected])
  const [collapsed, setCollapsed] = useState(true) // by default collapsed

  useEffect(() => {
    onSelect(checked)
  }, [checked, onSelect])

  useEffect(() => {
    setChecked([...selected])
  }, [selected])

  const handleToggle = item => () => {
    const currentIndex = findIndex(
      checked,
      checkedItem => checkedItem.value === item.value,
    )
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(item)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  return (
    <Box className={classes.root}>
      <div
        onClick={() => {
          setCollapsed(!collapsed)
        }}
        className={classes.labelWrapper}
      >
        <span className={classes.labelSpan}>
          {checked.map(checkedItem => checkedItem.label).join(', ') ||
            placeholder}
        </span>
        {collapsed ? (
          <ExpandMoreIcon className={classes.icon} />
        ) : (
          <ExpandLessIcon className={classes.icon} />
        )}
      </div>
      <Collapse in={!collapsed} timeout='auto' unmountOnExit>
        <List className={clsx(classes.list, classOverride)}>
          {items.map(({ value, label }) => {
            const labelId = `checkbox-list-label-${value}`

            const isChecked =
              findIndex(checked, checkedItem => checkedItem.value === value) !==
              -1

            return (
              <ListItem
                classes={{
                  root: clsx(classes.listItem, {
                    [classes.listItemSelected]: isChecked,
                  }),
                }}
                key={value}
                role={undefined}
                dense
                button
                onClick={handleToggle({ label, value })}
              >
                <ListItemIcon classes={{ root: classes.listItemCheckbox }}>
                  <Checkbox
                    color='primary'
                    edge='start'
                    checked={isChecked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  classes={{
                    root: clsx(
                      classes.listItemText,
                      { [classes.listItemTextSelected]: isChecked },
                      'am-subtitle2',
                    ),
                  }}
                  primaryTypographyProps={{
                    variant: isChecked ? 'subtitle1' : 'subtitle2',
                  }}
                  id={labelId}
                  primary={label}
                />
              </ListItem>
            )
          })}
          <ListItem
            classes={{
              root: clsx(classes.listItem),
            }}
            role={undefined}
            dense
            button
            onClick={() => {
              setChecked([])
            }}
          >
            <ListItemText
              classes={{
                primary: clsx(
                  classes.listItemText,
                  classes.listItemTextSelected,
                ),
              }}
              primaryTypographyProps={{ variant: 'button' }}
              primary='CLEAR ALL'
            />
          </ListItem>
        </List>
      </Collapse>
    </Box>
  )
}

CheckboxList.defaultProps = {
  items: [{ value: 'default', label: 'default' }],
  placeholder: 'Select',
  onSelect: () => {},
  selected: [],
  classOverride: '',
}

CheckboxList.propTypes = {
  items: PropTypes.array,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.array,
  classOverride: PropTypes.string,
}
