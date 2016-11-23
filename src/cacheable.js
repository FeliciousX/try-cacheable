import xs from 'xstream';

export function Cacheable( Component ) {
  return function( sources ) {
    const cache$ = xs.createWithMemory()

    const sinks = Component( Object.assign({}, sources, {cache: cache$ }) )

    const cacheReducer$ = sinks.cache
    .map( state => function updateCache( cache ) {
      if ( ! state.name ) {
        console.warn( 'State has no name attribute. Not caching.' )
        return cache;
      }

      return Object.assign({}, cache, {[state.name]: state } );
    });

    const proxyCache$ = cacheReducer$.fold((cache, reducer) => reducer( cache ), {})

    // cache$.imitate( proxyCache$ );
    proxyCache$.addListener({
      next: ( value ) => cache$.shamefullySendNext( value )
    })

    return sinks
  }
}
