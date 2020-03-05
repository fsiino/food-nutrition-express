import React, { Component, useState, useEffect } from 'react';

class Fieldset extends Component {
  constructor() {
    super();
    this.state = {
      nutrient: '',
      min: '',
      max: ''
    }
  }

  render() {
    return (
      <div className="fieldset-wrapper">
      <label>Nutrient: 
        <input type="text"
          value={this.state.val}
          onChange={e => this.setState({ nutrient: e.target.value })}
        />
      </label>
      <label>Minimum: 
        <input type="text"
          value={this.state.val}
          onChange={e => this.setState({ min: e.target.value })}
        />
      </label>
      <label>Maximum: 
        <input type="text"
          value={this.state.val}
          onChange={e => this.setState({ max: e.target.value })}
        />
      </label>
      </div>
    )
  }
}

export default Fieldset;
