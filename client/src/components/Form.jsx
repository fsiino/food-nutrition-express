import React, { Component, useState, useEffect } from 'react';
import Fieldset from './Fieldset';
import '../style/form.css';
import axios from 'axios';

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
      ],
      results: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    const fieldsets = this.state.fieldsets;
    for (let i = 0; i < fieldsets.length; i++) {
      const fieldset = fieldsets[i];
      axios.get(`/api/foods/${fieldset.nutrient}/${fieldset.min}/${fieldset.max}`)
        .then(results => {
          this.setState({
            results: results.data
          })
          console.log(this.state.results)
        })
        .catch(err => console.log(err)) //TODO: handle invalid/blank requests
        // .then(data => console.log(data))
    }
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
      <>
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
          {/* <input type="submit" value="Submit Query" />  */}
          <button onClick={this.handleSubmit}>Submit</button>
          {/* TODO: Return key doesnt submit, but rather hits New filter btn */}
        </form>
        <div>
          {this.state.results ? this.state.results.map(result => <li>{result.name}</li>) : 'results here..'}
        </div>
      </>
    )
  }
}

export default Form;