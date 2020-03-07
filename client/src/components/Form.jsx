import React, { useState } from 'react';
import axios from 'axios';
import Results from './Results';

const Form = () => {
  const newFieldset = {
    nutrient: '',
    min: '',
    max: ''
  }
  const [fieldsets, setFieldsets] = useState([newFieldset]);
  const [results, setResults] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleEnterKey = e => (
    e.key === 'Enter' ? handleSubmit(e) : null
  );

  const handleClearResults = e => {
    e.preventDefault();
    setResults([]);
    setNotFound(false);
  };

  const fetchAllFoods = e => {
    e.preventDefault();
    setLoading(true);
    axios.get(`/api/foods/all`)
      .then(res => {
        if (res.data.length > 0) {
          setResults(res.data);
          setLoading(false);
        } else {
          setResults([]);
          setLoading(false);
          setNotFound(true);
        }
      })
      .catch(err => setErrors(err));
  };

  const clearAllFields = () => {
    let fieldsetsCopy = fieldsets.slice(0,1);
    for (let key in fieldsetsCopy[0]) fieldsetsCopy[0][key] = '';
    setFieldsets([...fieldsetsCopy]);
    setErrors([]);
  };

  const addNewFieldset = (e) => {
    e.preventDefault();
    let fieldsetsCopy = fieldsets.slice();
    fieldsetsCopy.push(newFieldset);
    setFieldsets(fieldsetsCopy);
  };

  const removeFieldset = (e, fieldsetNum) => { //TODO: Not removing or inputting properly
    e.preventDefault();
    let fieldsetsCopy = fieldsets.slice();
    fieldsetsCopy.splice(fieldsetNum, 1); 
    setFieldsets(fieldsetsCopy);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let query = '';
    const fieldsetsCopy = fieldsets;
    for (let i = 0; i < fieldsetsCopy.length; i++) {
      const fieldsetCopy = fieldsetsCopy[i];
      let nutrient = fieldsetCopy.nutrient.toLowerCase();
      let min = fieldsetCopy.min;
      let max = fieldsetCopy.max;
      if (!nutrient) continue; 
      if (!min) min = 0;
      if (!max) max = 1000;
      query += `nutrient=${nutrient}&min=${min}&max=${max}/`
    }  
    axios.get(`/api/foods/search/${query}`)
      .then(res => {
        if (res.data.length > 0) {
          setResults(res.data);
          setLoading(false);
        } else {
          setResults([]);
          setLoading(false);
          setNotFound(true);
        }
      })
      .catch(err => setErrors(err));
  };

  const handleChange = (field, fieldsetNum) => {
    return e => {
      let fieldsetsCopy = fieldsets.slice();
      fieldsetsCopy[fieldsetNum][field] = e.target.value;
      setFieldsets(fieldsetsCopy)
    }
  };

  const loadedFoods = (
    results ? 
      results.map((result, i) => (
        <div key={`${i}1`} className="outter-grid-container">
          <div className="outter-grid-food">
            {result.name}
          </div>
          <div className="outter-grid-nutrients-values">
            {result.nutrients.map((nutrient, j) => (
              <div key={`${j}1`} className="inner-grid-container">
                <div className="inner-grid-nutrient">
                  {nutrient.nutrient}
                </div>
                <div className="inner-grid-value">
                  {nutrient.value} grams
                </div>
              </div>
            ))}
          </div>
        </div>
      ))
    : null
  )

  return (
    <>
      <div className="buttons-wrapper">
        <button onClick={clearAllFields}>Remove All Fieldsets</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="fieldsets-wrapper"> 
          {fieldsets.map((fieldset, i) => {
            return (
              <div className="fieldset-wrapper" 
                key={i}
              >
                <label>Nutrient:
                  <input required type="text"
                    value={fieldsets[i].nutrient}
                    onChange={handleChange("nutrient", i)} 
                    onKeyPress={handleEnterKey}
                  />
                </label>
                <label>Minimum:
                  <input type="text"
                    value={fieldsets[i].min}
                    onChange={handleChange("min", i)}
                    onKeyPress={handleEnterKey}
                  />
                </label>
                <label>Maximum:
                  <input type="text"
                    value={fieldsets[i].max}
                    onChange={handleChange("max", i)}
                    onKeyPress={handleEnterKey}
                  />
                </label>
                {i === 0 ? <button onClick={addNewFieldset}>Add Another Filter</button> : null}
                {i > 0 ? <input type="submit" onClick={(e, i) => removeFieldset(e,i)} value="Remove Fieldset" /> : null}
              </div>
            )
          })}
        </div>
        <div className="buttons-wrapper">
          <input type="submit" value="Submit Query" /> 
          <button onClick={handleClearResults}>Clear Results</button>
          <button onClick={fetchAllFoods}>Fetch All Foods</button>
        </div>
      </form>
      <div className="results-container">
        <Results loadedFoods={loadedFoods} isLoading={isLoading} notFound={notFound} errors={errors} />
      </div>
    </>
  );
};

export default Form;