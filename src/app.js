import xs from 'xstream'

import { Users } from './users'
import { Posts } from './posts'

export function App (sources) {
  const routes = {
    '/': Users,
    '/users': Users,
    '/posts': Posts
  }

  const component$ = sources.router.define( routes )
  .map( router => router.value( sources ) )

  return {
    DOM: component$.map( c => c.DOM ).flatten(),
    HTTP: component$.map( c => c.HTTP ).flatten(),
    router: component$.map( c => c.router ).flatten(),
    cache: component$.map( c => c.cache ).flatten()
  }
}
