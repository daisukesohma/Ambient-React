import { useRouteMatch } from 'react-router-dom'
import keys from 'lodash/keys'

export default function useAccountLayoutProps(path: string): any {
  const layoutPropsMap = {
    [`${path}/video-walls`]: { hasMobileVersion: false, spacing: 0 },
    [`${path}/infrastructure/cameras/stream-configuration`]: { spacing: 0 },
    [`${path}/dashboards/analytics`]: { darkMode: false },
    [`${path}/settings/users/select-federation`]: { sidebar: false },
    [`${path}/context/graph`]: { spacing: 0 },
    [`${path}/context/escalations`]: { hasMobileVersion: false },
    [`${path}/context/scheduler`]: { hasMobileVersion: false },
    [`${path}/live`]: { spacing: 0 },
    [`${path}/forensics`]: { spacing: 0 },
    [`${path}/infrastructure/cameras/stream-configuration`]: { spacing: 2 },
  }

  const match = useRouteMatch(keys(layoutPropsMap))
  return match ? layoutPropsMap[match.path] : {}
}
