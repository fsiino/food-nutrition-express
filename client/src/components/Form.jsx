import React, { Component, useState, useEffect } from 'react';
import Fieldset from './Fieldset';
import '../style/form.css';

class Form extends Component {
  constructor() {
    super();
    this.state = {
      fieldsets: [
        {
          nutrient: '',
          min: '',
          max: ''
        }
      ]
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  addNewFieldset(e) {
    e.preventDefault(); 
    let fieldsets = this.state.fieldsets.slice();
    fieldsets.push({
      nutrient: '',
      min: '',
      max: ''
    })
    this.setState({
      fieldsets: fieldsets
    })
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleChange(field, i) {
    return e => {
      let fieldsets = this.state.fieldsets.slice();
      fieldsets[i][field] = e.currentTarget.value;
      this.setState({
        fieldsets: fieldsets
      })
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <button onClick={(e) => this.addNewFieldset(e)}>New Filter</button>
        <div className="fieldsets-wrapper"> 
          {this.state.fieldsets.map((fieldset, i) => {
            return (
              <div className="fieldset-wrapper">
                <label>Nutrient:
                  <input type="text"
                    value={this.state.fieldsets[i].nutrient}
                    onChange={this.handleChange("nutrient", i)}
                  />
                </label>
                <label>Minimum:
                  <input type="text"
                    value={this.state.fieldsets[i].min}
                    onChange={this.handleChange("min", i)}
                  />
                </label>
                <label>Maximum:
                  <input type="text"
                    value={this.state.fieldsets[i].max}
                    onChange={this.handleChange("max", i)}
                  />
                </label>
              </div>
            )
          })}
        </div>
        <input type="submit" value="Submit Query" />
      </form>
    )
  }
}

export default Form;



  // const [Fieldsets, setFieldsets] = useState([])

  // const handleSubmit = e => {
  //   e.preventDefault();
  // }