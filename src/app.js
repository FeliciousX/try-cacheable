import xs from 'xstream'

import { Users } from './users'
import { Posts } from './posts'

export function App (sources) {
  return Posts( sources )
}
