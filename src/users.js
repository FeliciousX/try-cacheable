import {div, h1, button, ol, li} from '@cycle/dom'
import xs from 'xstream'

export function Users (sources) {
  const request$ = xs.never().startWith({
    url: 'http://jsonplaceholder.typicode.com/users',
    category: 'read',
    accept: 'json',
    method: 'GET'
  })

  const route$ = sources.DOM.select( '#go' ).events( 'click' )
  .mapTo( 'posts' )

  const response$ = sources.HTTP.select( 'read' ).flatten()
  .map( response => response.body );

  const reducer$ = response$.map( users => state => Object.assign({}, state, { users } ) )

  const initialState = { name: 'users', users: [] }
  const state$ = reducer$.fold( (state, reducer) => reducer( state ), initialState )
  .drop( 1 )

  const vtree$ = state$.map( state =>
    div({}, [
      h1( 'Users' ),
      button( { props: { id: 'go' } }, ['Posts'] ),
      ol({}, state.users.map( user => li( user.name ) ) )
    ])
  )
  const sinks = {
    DOM: vtree$,
    HTTP: request$,
    router: route$,
    cache: state$
  }
  return sinks
}
