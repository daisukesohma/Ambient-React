import { useRouteMatch } from 'react-router-dom'

export default () => {
  return useRouteMatch('/accounts/:account/video-walls/:videoWallId/edit')
}
