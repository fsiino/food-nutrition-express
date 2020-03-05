import React, { Component, useState, useEffect } from 'react';
import '../style/form.css';
import axios from 'axios';
import Results from './Results';
import { cloneDeep } from 'lodash'

class Form extends Component {
  constructor() {
    super();
    this.state = {
      fieldsets: [{
        nutrient: '',
        min: '',
        max: ''
      }],
      results: [],
      notFound: false,
      isLoading: false,
      errors: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClearResults = this.handleClearResults.bind(this);
  }

  handleClearResults(e) {
    e.preventDefault();
    this.setState({ 
      results: [],
      notFound: false
    })
  }

  clearAllFields() {
    let fieldsets = this.state.fieldsets.slice(0,1);
    for (let key in fieldsets[0]) fieldsets[0][key] = '';
    this.setState({
      fieldsets: [...fieldsets],
      errors: []
    })
  }

  addNewFieldset() {
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

  removeFieldset(e,fieldsetNum) { //TODO: Not removing properly
    let fieldsetsCopy = this.state.fieldsets.slice();
    fieldsetsCopy.splice(fieldsetNum, 1); 
    this.setState({
      fieldsets: fieldsetsCopy
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      isLoading: true
    })
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
      // Prefer axios.get over fetch for dynamic variables during async.
      axios.get(`/api/foods/${nutrient}/min=${min}&max=${max}`)
        .then(res => {
          if (res.data.length) {
            this.setState({
              results: res.data,
              isLoading: false
            })
          } else {
          this.setState({
            results: [],
            isLoading: false,
            notFound: true
          })
          }
        })
        .catch(err => this.setState({ errors: err }));
     }  
  }

  handleChange(field, fieldsetNum) {
    return e => {
      let fieldsets = this.state.fieldsets.slice();
      fieldsets[fieldsetNum][field] = e.target.value;
      this.setState({
        fieldsets: fieldsets
      })
    }
  }

  render() {
    const loadedFoods = (
      this.state.results ? 
        this.state.results.map((result, i) => 
        <li key={i}>{result.name} 
          <ul>{result.nutrients.map((nutrient, j) => 
            <li key={j}>{nutrient.nutrient} - {nutrient.value}{nutrient.unit}</li>)}
          </ul>
        </li>) 
      : null
    )

    return (
      <>
        <button onClick={() => this.addNewFieldset()}>Add Another Filter</button>
        <button onClick={() => this.clearAllFields()}>Clear All Fieldsets</button>
        <form onSubmit={this.handleSubmit}>
          <div className="fieldsets-wrapper"> 
            {this.state.fieldsets.map((fieldset, i) => {
              return (
                <div className="fieldset-wrapper" 
                  key={i}
                >
                  <label>Nutrient:
                    <input required type="text"
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
                  {i > 0 ? <input type="submit" onClick={(e, i) => this.removeFieldset(e,i)} value="Remove Fieldset" /> : null}
                </div>
              )
            })}
          </div>
          <input type="submit" value="Submit Query" /> 
          <button onClick={this.handleClearResults}>Clear Results</button>
          {/* TODO: Return key doesnt submit, but rather hits New filter btn */}
        </form>
        <div>
          <Results loadedFoods={loadedFoods} isLoading={this.state.isLoading} notFound={this.state.notFound} errors={this.errors} />
        </div>
      </>
    )
  }
}

export default Form;