import React from 'react'

import Searching from './Algorithms/Searching'
import Djkistra from './Algorithms/Djkistra'
import Sorting from './Algorithms/Sorting'
import PathSearch from './Algorithms/PathSearch'

const App = () => {
  return (
    <div>
      <Djkistra/>
      <PathSearch/>
      <Sorting/>
      <Searching/>
    </div>
  )
}

export default App