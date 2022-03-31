import { useRef } from 'react'

// Custom hook for using requestAnimationFrame
//
// https://css-tricks.com/using-requestanimationframe-with-react-hooks/
// https://codepen.io/testerez/pen/QWLGzee?editors=0010
//
// Usage: import into component
// useAnimationFrame(deltaTime => {
// doSomething
// })
//

// This is for "live" playing, which keeps track of live time, it "jumps"
//
const useAnimationFrame = callback => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef()
  const previousTimeRef = useRef()
  // const [willResetTime, setWillResetTime] = useState()

  const animate = time => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    // this is key to change the next line's logic
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  return {
    start: () => {
      requestRef.current = requestAnimationFrame(animate)
    },
    stop: () => {
      // rename to "stopLive"
      cancelAnimationFrame(requestRef.current)
      requestRef.current = undefined
    },
    resetPreviousTime: () => {
      // rename to
      cancelAnimationFrame(requestRef.current)
      cancelAnimationFrame(previousTimeRef.current)
      requestRef.current = requestAnimationFrame(animate)
    },
  }
}

export default useAnimationFrame
