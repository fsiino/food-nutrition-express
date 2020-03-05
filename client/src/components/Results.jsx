import React, { useState, useEffect } from 'react';

const Results = (props) => {

  return (
    <ol>
      {props.loadedFoods}
    </ol>
  )
}

export default Results;
