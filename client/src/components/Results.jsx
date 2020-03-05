import React, { useState, useEffect } from 'react';

const Results = (props) => {

  if (props.isLoading) {
    return <h3>Loading...</h3>
  } else if (props.loadedFoods.length) {
    return (
      <ol>
        {props.loadedFoods}
      </ol>
    )
  } else if (props.notFound) {
    return <h3>No results found.</h3>
  } else {
    return <h3>Start your search.</h3>
  }
}

export default Results;
