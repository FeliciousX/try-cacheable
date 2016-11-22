import {div, h1, button, ol, li} from '@cycle/dom'
import xs from 'xstream'

export function App (sources) {
  const request$ = sources.DOM.select( '#btn' ).events( 'click' )
  .take( 1 )
  .mapTo({
    url: 'http://jsonplaceholder.typicode.com/users',
    category: 'read',
    accept: 'json',
    method: 'GET'
  })

  const response$ = sources.HTTP.select( 'read' ).flatten()
  .map( response => response.body );

  const reducer$ = response$.map( users => state => Object.assign({}, state, { users } ) )

  const initialState = { users: [] }
  const state$ = reducer$.fold( (state, reducer) => reducer( state ), initialState )

  const vtree$ = state$.map( state =>
    div({}, [
      h1( 'Hello There' ),
      button( { props: { id: 'btn' } }, ['Click me'] ),
      ol({}, state.users.map( user => li( user.name ) ) )
    ])
  )
  const sinks = {
    DOM: vtree$,
    HTTP: request$,
    cache: state$
  }
  return sinks
}
