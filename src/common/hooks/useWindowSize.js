import { useLayoutEffect, useState } from 'react'

export default (ref = null) => {
  const [size, setSize] = useState([0, 0])
  useLayoutEffect(() => {
    function updateSize() {
      let pair
      if (ref && ref.current) {
        pair = [ref.current.clientHeight, ref.current.clientWidth]
      } else {
        pair = [window.innerHeight, window.innerWidth]
      }
      setSize(pair)
    }

    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [ref])
  return size
}
