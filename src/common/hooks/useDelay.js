// Alex Leontev

import { useEffect, useState } from 'react'

export default function useDelay(delay) {
  const [render, setRender] = useState(false)

  useEffect(() => {
    setTimeout(() => setRender(true), delay)
  }, [delay])

  return render
}
