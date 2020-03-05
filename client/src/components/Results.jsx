import React, { useState, useEffect } from 'react';

const Results = (props) => {

  if (props.isLoading) {
    return <h3>Loading...</h3>
  } else {
    return (
      <ol>
        {props.loadedFoods}
      </ol>
    )
  }
}

export default Results;
