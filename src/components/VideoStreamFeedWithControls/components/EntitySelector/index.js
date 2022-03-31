import React, { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { SearchableSelectDropdown } from 'ambient_ui'
import chroma from 'chroma-js'
import { Icon } from 'react-icons-kit'
import { search } from 'react-icons-kit/fa/search'
import clsx from 'clsx'
import get from 'lodash/get'
import EntitySubSelectionTree from 'components/VideoStreamControls/data/EntitySubSelectionTree'
import { useDispatch, useSelector } from 'react-redux'
import { setVideoStreamValues } from 'redux/slices/videoStreamControls'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

const colorPalette = [
  '#1ab394',
  '#0ABFFC',
  '#a800b7',
  '#000000',
  '#f8ac59',
  '#ff19eb',
]

const propTypes = {
  videoStreamKey: PropTypes.string.isRequired,
}

const EntitySelector = ({ videoStreamKey }) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const selectedEntities = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'selectedEntities',
    }),
  )

  const entitySelections = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'entitySelections',
    }),
  )

  const originalEntities = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'originalEntities',
    }),
  )

  const [displayEntitySelector, setDisplayEntitySelector] = useState(false)
  const [subTree, setSubTree] = useState(EntitySubSelectionTree)

  const entityToggleButtonText = displayEntitySelector ? 'Hide' : 'Entities'
  const entityOptionsSelectFormat = useMemo(() => {
    let k = 0
    return Array.isArray(entitySelections)
      ? entitySelections.map((entity, i) => {
          const selectedColor = colorPalette[k]
          k = (k + 1) % colorPalette.length
          return {
            label: entity.name,
            value: entity.id,
            idx: i,
            color: selectedColor,
            type: entity.type || 'entity',
          }
        })
      : []
  }, [entitySelections])

  const handleEntitySelection = useCallback(
    selection => {
      // Determine how many selections were made.
      const level = get(selection, 'length', 0)
      // If 1 get level 1 tree (interactions or props)
      // If 2 get level 2 (interactions objects)

      // TODO: @rodaan - Currently structured to only 3 levels for now
      //  Will need to set up to be more flexible for now
      let newEntitySelectorOptions
      if (level === 0) {
        newEntitySelectorOptions = originalEntities
        setSubTree(EntitySubSelectionTree)
      } else if (level === 1) {
        // Initial entities come from DB
        newEntitySelectorOptions =
          EntitySubSelectionTree[selection[0].label].options
        setSubTree(EntitySubSelectionTree[selection[0].label].options)
      } else if (level === 2) {
        const last = selection[level - 1]
        // Rest come from EntitySubSelection Tree
        newEntitySelectorOptions = get(subTree, `[${last.idx}].options`, [])
      }

      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            entitySelections: newEntitySelectorOptions,
            selectedEntities: selection || [],
          },
        }),
      )
    },
    [dispatch, originalEntities, subTree, videoStreamKey],
  )

  const btn = useMemo(
    () => (
      <button
        id='entity-display'
        style={{ display: 'flex' }}
        className='playback-button playback-live-indicator'
        type='button'
        onClick={() => {
          setDisplayEntitySelector(!displayEntitySelector)
        }}
      >
        <span style={{ color: palette.primary[300], paddingRight: 4 }}>
          <Icon icon={search} />
        </span>
        <span className={clsx('am-caption', 'buttonText')}>
          {entityToggleButtonText}
        </span>
      </button>
    ),
    [displayEntitySelector, entityToggleButtonText],
  )

  const displayEntity = useMemo(
    () =>
      displayEntitySelector ? (
        <div className='entity_selector_container'>
          <SearchableSelectDropdown
            options={entityOptionsSelectFormat}
            value={selectedEntities}
            onChange={handleEntitySelection}
            isMulti
            styles={{
              control: styles => ({ ...styles, backgroundColor: 'white' }),
              option: (styles, { isDisabled }) => {
                return {
                  ...styles,
                  cursor: isDisabled ? 'not-allowed' : 'default',
                }
              },
              multiValue: (styles, { data }) => {
                const color = chroma(data.color)
                return {
                  ...styles,
                  backgroundColor: color.alpha(0.1).css(),
                }
              },
              multiValueLabel: (styles, { data }) => ({
                ...styles,
                color: data.color,
              }),
              multiValueRemove: (styles, { data }) => ({
                ...styles,
                color: data.color,
                ':hover': {
                  backgroundColor: data.color,
                  color: 'white',
                },
              }),
            }}
            placeholder='Select Entities'
            autoFocus
          />
        </div>
      ) : null,
    [
      displayEntitySelector,
      entityOptionsSelectFormat,
      handleEntitySelection,
      selectedEntities,
    ],
  )

  return (
    <>
      {btn}
      {displayEntity}
    </>
  )
}

EntitySelector.propTypes = propTypes

export default EntitySelector
