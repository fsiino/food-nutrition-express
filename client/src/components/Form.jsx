import React, { Component, useState, useEffect } from 'react';
import FormField from './FormField';

class Form extends Component {
  constructor() {
    super();
    this.state = {
      formFields: [
        
      ]
    }
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <form>
        <FormField />
      </form>
    )
  }
}

export default Form;



  // const [formFields, setFormFields] = useState([])

  // const handleSubmit = e => {
  //   e.preventDefault();
  // }