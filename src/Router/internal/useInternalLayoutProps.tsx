import { useRouteMatch } from 'react-router-dom'
import keys from 'lodash/keys'
import extend from 'lodash/extend'
// src
import { sidebarOptions } from 'components/Sidebar/menus/internal'

export default function useInternalLayoutProps(path: string): any {
  const layoutPropsMap = {
    [`${path}/verification-portal`]: { sidebar: false, spacing: 0 },
    [`${path}/data-infrastructure`]: { sidebar: false, spacing: 0 },
  }

  const match = useRouteMatch(keys(layoutPropsMap))
  const commonProps = { sidebarOptions }
  const dynamicProps = match ? layoutPropsMap[match.path] : {}

  return extend({}, commonProps, dynamicProps)
}
