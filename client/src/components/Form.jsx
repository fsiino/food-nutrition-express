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
      results: [],
      isLoading: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  clearAllFields() {
    let fieldsets = this.state.fieldsets.slice(0);
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

  removeFieldset(e,fieldsetNum) { //TODO: Not removing properly
    let fieldsetsCopy = this.state.fieldsets.slice();
    fieldsetsCopy.splice(fieldsetNum, 1); 
    this.setState({
      fieldsets: fieldsetsCopy
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
      if (!nutrient) continue; //TODO: flag that this field is mandatory
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
        <button onClick={(e) => this.addNewFieldset(e)}>New Filter</button>
        <button onClick={() => this.clearAllFields()}>Clear All Filters</button>
        <button onClick={() => this.setState({ results: [] })}>Clear Results</button>
        <form onSubmit={(e) => this.handleSubmit(e)}>
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
                  {i > 0 ? <input type="submit" onClick={(e, i) => this.removeFieldset(e,i)} value="Remove Fieldset" /> : null}
                </div>
              )
            })}
          </div>
          <input type="submit" value="Submit Query" /> 
          {/* TODO: Return key doesnt submit, but rather hits New filter btn */}
        </form>
        <div>
          <Results loadedFoods={loadedFoods} isLoading={this.state.isLoading} />
        </div>
      </>
    )
  }
}

export default Form;