import { useEffect, useState } from 'react'

export const useSearch = (value, delay) => {
  // Save a local copy of `value` in this state which is local to our hook
  const [state, setState] = useState(value)

  useEffect(() => {
    // Set timeout to run after delay
    const handler = setTimeout(() => setState(value), delay)

    // clear the setTimeout listener on unMount
    return () => clearTimeout(handler)
  }, [value, delay])

  return state
}
