import React, { Component, useState, useEffect } from 'react';

class FormField extends Component {
  constructor() {
    super();
    this.state = {
      val: ''
    }
  }

  render() {
    return (
        <input type="text"
          value={this.state.val}
          onChange={e => this.setState({ val: e.target.value })}
        >

        </input>
    )
  }
}

export default FormField;
