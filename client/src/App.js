import React from 'react';
import './style/form.css';
import './style/results.css';
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
