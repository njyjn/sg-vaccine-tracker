import * as React from 'react'
import { Image } from 'semantic-ui-react'

import '../App.css';

interface NotFoundProps {
}

interface NotFoundState {
}

export class NotFound extends React.PureComponent<NotFoundProps, NotFoundState> {
  render() {
    return (
      <div className='App'>
        <div className='App-header'>
          <Image src='/404.gif' alt='Not found'></Image>
        </div>
      </div>
    )
  }
}
