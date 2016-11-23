import {div, h1, button, ol, li} from '@cycle/dom'
import xs from 'xstream'

function debug( prefix ) {
  return value => {
    console.log( prefix, value )
    return value
  }
}

export function Posts (sources) {
  const request$ = sources.cache
  .filter( cache => ! cache.posts )
  .debug( 'request$' )
  .mapTo({
    url: 'https://jsonplaceholder.typicode.com/posts',
    category: 'read',
    accept: 'json',
    method: 'GET'
  })

  const route$ = sources.DOM.select( '#go' ).events( 'click' )
  .mapTo( 'users' )

  const response$ = sources.HTTP.select( 'read' ).flatten()
  .map( response => response.body );

  const responseReducer$ = response$.map( posts => state => Object.assign({}, state, { posts } ) )
  const useCacheReducer$ = sources.cache
  .filter( cache => cache.posts )
  .map( cache => () => cache.posts )
  .take( 1 ) // take 1 doesn't work
  .map( debug( 'x' ) )

  const reducer$ = xs.merge( responseReducer$, useCacheReducer$ )

  const initialState = { name: 'posts', posts: [] }
  const state$ = reducer$.fold( (state, reducer) => reducer( state ), initialState )
  .drop( 1 )

  const vtree$ = state$.map( state =>
    div({}, [
      h1( 'Posts' ),
      button( { props: { id: 'go' } }, ['Users'] ),
      ol({}, state.posts.map( post => li( post.title ) ) )
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
