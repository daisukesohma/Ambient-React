import React, { useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import { useSelector, useDispatch, batch } from 'react-redux'
import EntitySearch from 'components/VideoStreamV2/components/EntitySearch'
import { setSearchQuery, resetSearch } from 'redux/forensics/actions'

import useForensicData from '../../../../hooks/useForensicData'

import useEntities from './useEntities'
import useStyles from './styles'

const ForensicsSearchBar = () => {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const [entityOptions, selectedEntities, setSelectedEntities] = useEntities()
  const [fetchRegionStats, fetchEntities] = useForensicData()
  const loadingSites = useSelector(state => state.forensics.loadingSites)

  useEffect(() => {
    if (selectedEntities.length > 0) {
      // Query is ie. ["entity_person", "interaction_removed", "entity_box"]
      const query = selectedEntities.map(el => {
        return `${el.type}_${el.label}`
      })

      batch(() => {
        dispatch(setSearchQuery(query))
        fetchRegionStats({ q: query })
        fetchEntities({ q: query })
      })
    } else {
      dispatch(resetSearch())
    }
  }, [selectedEntities, dispatch]) //eslint-disable-line

  return (
    <Grid
      container
      direction='row'
      justify='space-between'
      alignItems='center'
      className={classes.wrapper}
    >
      <div id='entity-search-container' className={classes.searchContainer}>
        <span style={{ marginRight: 20 }}>
          <EntitySearch
            darkMode
            selectProps={{
              isDisabled: loadingSites,
            }}
            entitySelectorOptions={entityOptions}
            handleEntitySelection={setSelectedEntities}
            selectedEntities={selectedEntities}
          />
        </span>
      </div>
    </Grid>
  )
}

export default ForensicsSearchBar
