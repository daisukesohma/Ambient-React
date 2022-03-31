import { useHistory, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAbility } from '@casl/react'

import { AbilityContext } from 'rbac'
import { setProvisionNewModalValue } from '../redux'

const useMenuItems = ({ node }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { account } = useParams()
  const ability = useAbility(AbilityContext)

  const addNodeItem = {
    label: 'Provision new node',
    onClick: () => {
      dispatch(
        setProvisionNewModalValue({
          id: node.id,
          isOpen: true,
          tabIndex: 0,
        }),
      )
    },
  }

  // default items
  let menuItems = []

  // conditional items
  if (ability.can('create', 'NodeProvision')) {
    menuItems = [...menuItems, addNodeItem]
  }

  return [menuItems]
}

export default useMenuItems
