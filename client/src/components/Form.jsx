import React, { Component, useState, useEffect } from 'react';
import '../style/form.css';
import axios from 'axios';
import Results from './Results'

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
    this.handleChange = this.handleChange.bind(this);
  }

  clearAllFields() {
    let fieldsets = this.state.fieldsets.slice(0,1);
    for (let key in fieldsets[0]) fieldsets[0][key] = '';
    this.setState({
      fieldsets: [...fieldsets]
    })
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
    const fieldsets = this.state.fieldsets;
    for (let i = 0; i < fieldsets.length; i++) {
      const fieldset = fieldsets[i];
      let nutrient = fieldset.nutrient;
      let min = fieldset.min;
      let max = fieldset.max;
      if (!nutrient) continue;
      if (!min) min = 0;
      if (!max) max = 1000;
      axios.get(`/api/foods/${nutrient}/min=${min}&max=${max}`)
        .then(res => {
          this.setState({
            results: res.data
          })
        })
        .catch(err => console.log(err)) //TODO: handle invalid/blank requests e.g. nothing found
    }
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

    const foodResults = this.state.results ? this.state.results.map((result, i) => <li key={i}>{result.name}</li>) : null

    return (
      <>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <button onClick={(e) => this.addNewFieldset(e)}>New Filter</button>
          <button onClick={() =>this.clearAllFields()}>Clear All Filters</button>
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
          {/* TODO: Return key doesnt submit, but rather hits New filter btn */}
        </form>
        <div>
          <Results loadedFoods={foodResults} />
        </div>
      </>
    )
  }
}

export default Form;