import React from 'react';
import './style/style.css';
import Header from './components/Header';
import Form from './components/Form';

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <Form />
    </div>
  );
}

export default App;
