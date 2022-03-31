import { useRouteMatch } from 'react-router-dom'

export default () => {
  return useRouteMatch('/accounts/:account/context/escalations/profiles')
}
