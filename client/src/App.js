import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  componentDidMount() {
    fetch('/api/foods', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => console.log(data))
  }

  render() {
    return (
      <>
      <div>
hi
      </div>
      </>
    );
  }
}

export default App;
