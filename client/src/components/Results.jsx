import React from 'react';

const Results = ({loadedFoods, isLoading, notFound, errors}) => {

  if (isLoading) {
    return <h3>Loading...</h3>
  } else if (loadedFoods.length) {
    return (
      <ol>
        {loadedFoods}
      </ol>
    )
  } else if (notFound) {
    return <h3>No results found.</h3>
  } else {
    return <h3>Start your search.</h3>
  }

}

export default Results;
