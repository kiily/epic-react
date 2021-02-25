// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import { PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'
import { ErrorBoundary } from 'react-error-boundary'


// class ErrorBoundary extends React.Component {
//   state = { error: null }

//   static getDerivedStateFromError(error) {
//     return { error }
//   }

//   componentDidCatch(error, errorInfo) {
//     // Used to log things
//     console.error('Error', error)
//     console.error('Error info', errorInfo)
//   }

//   render() {
//     if (this.state.error) {
//       return <this.props.FallbackComponent error={this.state.error} />
//     }

//     return this.props.children;
//   }
// }
function PokemonInfo({ pokemonName }) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    error: null,
    pokemon: null
  })

  const { status, error, pokemon } = state

  // const [pokemon, setPokemon] = React.useState(null)
  // const [error, setError] = React.useState(null)

  // Smart way to handle errors without depending on the other states
  // It's easier to always code the error handling straight away
  // when implementing as it will always make for a cleaner
  // user experience
  // Tracks status of component at any given time
  // const [status, setStatus] = React.useState('idle')
  React.useEffect(() => {
    if (!pokemonName) return
    // There is not need to get the prevState unless we need to
    // in this case it was not necessary
    setState(prevState => ({
      ...prevState,
      status: 'pending',
      pokemon: null
    }))
    // setPokemon(null)
    // setStatus('pending')
    fetchPokemon(pokemonName).then((pokemonData) => {
      // These sort of calls are more elegantly resolved
      // with a useReducer and avoid lots of unnecessary
      // updates to the state; alternatively, can just store the 
      // state in a single object
      // setPokemon(pokemonData)
      // setStatus('resolved')
      setState(prevState => ({
        ...prevState,
        status: 'resolved',
        pokemon: pokemonData
      }))
    }, error => {
      setState(prevState => ({
        ...prevState,
        status: 'rejected',
        error
      }))
    })

    // setError(err)
    // setStatus('rejected')

  }, [pokemonName])


  // This is an instance where if statements are just nicer
  // and more readable than ternaries
  if (status === 'rejected') {
    // return <div role="alert">
    //   There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
    // </div>
    // This will be caught by the error boundary
    throw error
  }

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should never happen')
}

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return <div role="alert">
    There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
    <button onClick={resetErrorBoundary}>
      Try Again
    </button>
  </div>
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {/* DO NOT PUT IT AROUND THE WHOLE CODE but do use
        them carefully */}
        {/* Can pass a key here to force a re-render when the pokemonName
        changes; Key here works but remounts both components unecessarily and it causes
        a rapid flash of the initial state */}
        {/* <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}> */}
        {/* resetKeys is an array of values that when changed will reset the error boundary
        correctly*/}
        <ErrorBoundary
          onReset={handleReset}
          FallbackComponent={ErrorFallback}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
