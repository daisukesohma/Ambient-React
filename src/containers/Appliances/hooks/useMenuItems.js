import { useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const useMenuItems = ({ node, site }) => {
  const isInternal = useSelector(state => state.auth.profile.internal)
  const history = useHistory()
  const { account } = useParams()

  let menuItems = [
    {
      label: 'Start Stream Discovery',
      onClick: () => {
        history.push(
          `/accounts/${account}/infrastructure/discovery/create?site=${site.slug}&node=${node.identifier}`,
        )
      },
    },
  ]

  if (isInternal) {
    menuItems = [
      ...menuItems,
      // {
      //   // to deprecate
      //   label: 'View Request Status',
      //   onClick: () =>
      //     history.push(
      //       `/accounts/${account}/infrastructure/sites/${site.slug}/appliances/${node.identifier}/status`,
      //     ),
      // },
      // {
      //   // to deprecate
      //   label: 'Add Cameras',
      //   onClick: () =>
      //     history.push(
      //       `/accounts/${account}/sites/infrastructure/${site.slug}/appliances/${node.identifier}/cameras/config`,
      //     ),
      // },
    ]
  }

  return [menuItems]
}

export default useMenuItems
