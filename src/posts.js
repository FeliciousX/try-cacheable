import {div, h1, button, ol, li} from '@cycle/dom'
import xs from 'xstream'

export function Posts (sources) {
  const request$ = sources.DOM.select( '#btn' ).events( 'click' )
  .mapTo({
    url: 'http://jsonplaceholder.typicode.com/posts',
    category: 'read',
    accept: 'json',
    method: 'GET'
  })

  const response$ = sources.HTTP.select( 'read' ).flatten()
  .map( response => response.body );

  const reducer$ = response$.map( posts => state => Object.assign({}, state, { posts } ) )

  const initialState = { posts: [] }
  const state$ = reducer$.fold( (state, reducer) => reducer( state ), initialState )

  const vtree$ = state$.map( state =>
    div({}, [
      h1( 'Posts' ),
      button( { props: { id: 'btn' } }, ['Click me'] ),
      ol({}, state.posts.map( post => li( post.title ) ) )
    ])
  )
  const sinks = {
    DOM: vtree$,
    HTTP: request$,
    cache: state$
  }
  return sinks
}
