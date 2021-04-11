import './App.css';
import { Component } from 'react';
import { Counts } from './components/Counts';

export interface AppProps {};

export interface AppState {};

export default class App extends Component<AppProps, AppState> {
  render() {
    return (
      <div className="App App-header">
        {this.displayCount()}
      </div>
    )
  }

  displayCount() {
    return <Counts {...this.props}/>
  }
};
