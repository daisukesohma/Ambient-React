import { useEffect, useState } from 'react'
import get from 'lodash/get'

import EntitySubSelectionTree from 'components/VideoStreamV2/data/EntitySubSelectionTree'

const useEntities = () => {
  // FUTURE @Rodaan @eric @varun - get from DB or seed into redux or component
  const originalEntities = [
    {
      name: 'person',
      friendly_name: 'person',
      icon: '/static/img/entities/person.png',
      id: 1,
    },
    {
      name: 'car',
      friendly_name: 'car',
      icon: '/static/img/entities/car.png',
      id: 2,
    },
    { name: 'chair', friendly_name: 'Chair', icon: '', id: 4 },
    { name: 'laptop', friendly_name: 'Laptop', icon: '', id: 6 },
    { name: 'backpack', friendly_name: 'backpack', icon: '', id: 7 },
    { name: 'door', friendly_name: 'door', icon: '', id: 9 },
    { name: 'box', friendly_name: 'box', icon: '', id: 10 },
    { name: 'bicycle', friendly_name: 'bicycle', icon: '', id: 11 },
  ]
  const [entityOptions, setEntityOptions] = useState(originalEntities)
  const [selectedEntities, setSelectedEntities] = useState([])
  const [subTree, setSubTree] = useState()

  useEffect(() => {
    const level = selectedEntities && selectedEntities.length
    let options = []
    if (level === 0) {
      options = originalEntities
    } else if (level === 1) {
      // Initial entities come from DB
      const selectionLabel = selectedEntities[0].label
      const selectedTree = EntitySubSelectionTree[selectionLabel]
      options = get(selectedTree, 'options', [])
      setSubTree(options)
    } else if (level === 2) {
      const last = selectedEntities[level - 1]
      options = subTree[last.idx].options
    } else if (level === 3) {
      options = []
    } else {
      options = originalEntities
      setSubTree(EntitySubSelectionTree)
    }

    setEntityOptions(options)
  }, [selectedEntities]) // eslint-disable-line

  return [entityOptions, selectedEntities, setSelectedEntities]
}

export default useEntities
