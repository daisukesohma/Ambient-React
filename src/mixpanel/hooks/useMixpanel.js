import { useEffect } from 'react'
import trackEventToMixpanel from '../utils/trackEventToMixpanel'

export default (eventEnum, eventData = {}, deps = []) => {
  useEffect(() => {
    trackEventToMixpanel(eventEnum, eventData)
  }, deps)
}
