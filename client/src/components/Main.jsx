import React, { useState, useEffect } from 'react';

const Main = () => {
  const [loadedFoods, setLoadedFoods] = useState([]);

  useEffect(() => {
    fetch('/api/foods', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        let output = data;
        setLoadedFoods(output);
      })
      .catch(err => console.log(err))
  },[])

  return (
    <div>
      <ul>
        {loadedFoods.map(food => {
          return (
            <li key={food.ndbno} > 
              {food.name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Main;
