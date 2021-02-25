// Basic Forms
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

function UsernameForm({ onSubmitUsername }) {
  const [error, setError] = React.useState(null)

  const inputRef = React.useRef()
  const handleSubmit = (event) => {
    // Call `event.preventDefault()` to prevent the default behavior of form submit
    // events (which refreshes the page).
    event.preventDefault()
    const value = inputRef.current.value
    // || event.target.elements[0].value || event.target.elements.usernameInput.value (preferred)
    onSubmitUsername(value)
  }

  const handleInputChange = (event) => {
    event.preventDefault();
    // ALTERNATIVE
    // const {value} = event.target
    // const isLowerCase = value === value.toLowerCase()
    // setError(isLowerCase ? null : 'Username must be lower case')
    const error = /[A-Z]/.test(inputRef.current.value) ? 'Username must be lower case' : null
    setError(error)
  }

  // 🐨 make sure to associate the label to the input.
  // to do so, set the value of 'htmlFor' prop of the label to the id of input
  return (
    <form onSubmit={handleSubmit} >
      <div>
        <label htmlFor="usernameInput">Username:</label>
        <input ref={inputRef} id="usernameInput" type="text" onChange={handleInputChange} />
      </div>
      <div role="alert" style={{ color: 'red' }}>
        {error}
      </div>
      <button type="submit" disabled={Boolean(error)}>Submit</button>
    </form >
  )

  // See extra 3 solution as it involved removing the entirety of the error logic
}

function App() {
  const onSubmitUsername = username => alert(`You entered: ${username}`)
  return <UsernameForm onSubmitUsername={onSubmitUsername} />
}

export default App
