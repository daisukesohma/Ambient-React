import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEmpty, map, times } from 'lodash'
import { Box, Card, CardContent } from '@material-ui/core'

import ItemSkeleton from 'features/StreamConfiguration/commonComponents/ItemSkeleton'
import { useFlexStyles } from 'common/styles/commonStyles'
import { setMode } from 'features/StreamConfiguration/streamConfigurationSlice'

import ZoneItem from './components/ZoneItem'
import EntityItem from './components/EntityItem'
import RegionEditor from './components/RegionEditor'
import AccessReaderEditor from './components/AccessReaderEditor'
import ProblematicStatusEditor from './components/ProblematicStatusEditor'
import NoteEditor from './components/NoteEditor'
import useStyles from './styles'

export default function LayerSelector() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const flexClasses = useFlexStyles()
  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const auditLoading = useSelector(
    state => state.streamConfiguration.auditLoading,
  )

  const handleModeSelection = selectedMode =>
    dispatch(setMode({ mode: selectedMode }))

  const { entities } = activeStream

  if (auditLoading && isEmpty(entities)) {
    return times(10, i => <ItemSkeleton key={i} />)
  }

  return (
    <Box mt={3}>
      <div>
        <Box ml={1} className='am-body2'>
          <ProblematicStatusEditor />
        </Box>

        <Box ml={1} className='am-body2'>
          Access Readers
        </Box>
        <AccessReaderEditor />
      </div>
      <div>
        <Box ml={1} className='am-body2'>
          Region
        </Box>
        <RegionEditor />
      </div>
      <div>
        <Box ml={1} className='am-body2'>
          Zones
        </Box>
        <ZoneItem />
      </div>
      <div>
        <Box ml={1} className='am-body2'>
          Notes
        </Box>
        <NoteEditor />
      </div>
      <div>
        <Box ml={1} mt={3} className='am-body2'>
          Entities
        </Box>
        <div>
          {!auditLoading && isEmpty(entities) && (
            <Card className={classes.emptyCardRoot}>
              <CardContent>
                <span className={flexClasses.row}>
                  <span className={'am-caption'} style={{ marginLeft: 8 }}>
                    You have no saved entities
                  </span>
                </span>
              </CardContent>
            </Card>
          )}
          {!isEmpty(entities) && (
            <div>
              {map(entities, entity => (
                <EntityItem
                  key={entity.id}
                  entity={entity}
                  onClick={() => handleModeSelection(entity.annotationType)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Box>
  )
}
