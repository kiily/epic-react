// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// const useLocalStorageState = (key, defaultValue) => {
//   // 🐨 initialize the state to the value from localStorage
//   // Lazy initialization to avoid performance bottleneck when reading from storage
//   const [state, setState] = React.useState(
//     () => window.localStorage.getItem(key) || defaultValue,
//   )
//   React.useEffect(() => {
//     window.localStorage.setItem(key, state)
//   }, [key, state])

//   return [state, setState]
// }

const useLocalStorageStateObj = (
  key,
  defaultValue,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) => {
  // 🐨 initialize the state to the value from localStorage
  // Lazy initialization to avoid performance bottleneck when reading from storage
  const [state, setState] = React.useState(
    () => {
      const valueInLocalStorage = window.localStorage.getItem(key)
      if (valueInLocalStorage) {
        // the try/catch is here in case the localStorage value was set before
        // we had the serialization in place (like we do in previous extra credits)
        try {
          return deserialize(valueInLocalStorage)
        } catch (error) {
          window.localStorage.removeItem(key)
        }
      }
      // If the default is a function, we are basically allowing lazy initialization for 
      // this hook so we can do the same as we are doing in the useState
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
  )

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}

function Greeting({ initialName = '' }) {
  const [name, setName] = useLocalStorageStateObj('name', initialName);
  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
