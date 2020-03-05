import React, { useState, useEffect } from 'react';

const Results = () => {
  const [loadedFoods, setLoadedFoods] = useState([]);

  useEffect(() => {
    fetch('/api/foods', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setLoadedFoods(data))
      .catch(err => console.log(err))
  },[]);

  if (!loadedFoods) {
    return <div>'Loading...'</div>
  }

  return (
    <div>
      <div>
        {/* {loadedFoods.map(food => (
          <li key={food.ndbno}>{food.name}</li>
        )
        )} */}
      </div>
    </div>
  )
}

export default Results;
