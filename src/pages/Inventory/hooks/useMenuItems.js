import { useSelector } from 'react-redux'

const useMenuItems = () => {
  const isInternal = useSelector(state => state.auth.user.internal)

  let menuItems = [
    {
      label: 'Edit',
      onClick: () => {},
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
