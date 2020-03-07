import React from 'react';

const Results = ({loadedFoods, isLoading, notFound, errors}) => {

  if (isLoading) {
    return <h3>Loading...</h3>
  } else if (loadedFoods.length > 0) {
    return (
      <ol>
        {loadedFoods}
      </ol>
    )
  } else if (notFound) {
    return <h3>No results found.</h3>
  } else {
    return (
      <>
        <h4 style={{ color: "red" }}>{errors}</h4>
        <h3>Results will display here.</h3>
      </>
    )
  }
}

export default Results;
