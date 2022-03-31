import { useCallback } from 'react'

function useTriggerResize() {
  return useCallback(() => {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 0)
  }, [])
}

export default useTriggerResize
