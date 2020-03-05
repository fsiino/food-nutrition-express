import React, { useState, useEffect } from 'react';
import '../style/style.css';
import axios from 'axios';
import Results from './Results';

const Form = () => {
  const newFieldset = {
    nutrient: '',
    min: '',
    max: ''
  }
  const [fieldsets, setFieldsets] = useState([newFieldset])
  const [results, setResults] = useState([])
  const [notFound, setNotFound] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])

  const handleEnterKey = e => (
    e.key === 'Enter' ? handleSubmit(e) : null
  )

  const handleClearResults = e => {
    e.preventDefault();
    setResults([])
    setNotFound(false)
  }

  const clearAllFields = () => {
    let fieldsetsCopy = fieldsets.slice(0,1);
    for (let key in fieldsetsCopy[0]) fieldsetsCopy[0][key] = '';
    setFieldsets([...fieldsetsCopy])
    setErrors([])
  }

  const addNewFieldset = () => {
    let fieldsetsCopy = fieldsets.slice();
    fieldsetsCopy.push(newFieldset)
    setFieldsets(fieldsetsCopy)
  }

  const removeFieldset = (e, fieldsetNum) => { //TODO: Not removing or inputting properly
    let fieldsetsCopy = fieldsets.slice();
    if (fieldsetNum !== -1) fieldsetsCopy.splice(fieldsetNum, 1); 
    setFieldsets(fieldsetsCopy)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    e.preventDefault();
    const fieldsetsCopy = fieldsets;
    for (let i = 0; i < fieldsetsCopy.length; i++) {
      const fieldsetCopy = fieldsetsCopy[i];
      let nutrient = fieldsetCopy.nutrient.toLowerCase();
      let min = fieldsetCopy.min;
      let max = fieldsetCopy.max;
      if (!nutrient) continue; 
      if (!min) min = 0;
      if (!max) max = 1000;
      // Prefer axios.get over fetch for dynamic variables during async.
      axios.get(`/api/foods/${nutrient}/min=${min}&max=${max}`)
        .then(res => {
          if (res.data.length) {
            setResults(res.data)
            setLoading(false)
          } else {
            setResults([])
            setLoading(false)
            setNotFound(true)
          }
        })
        .catch(err => setErrors(...errors))
     }  
  }

  const handleChange = (field, fieldsetNum) => {
    return e => {
      let fieldsetsCopy = fieldsets.slice();
      fieldsetsCopy[fieldsetNum][field] = e.target.value;
      setFieldsets(fieldsetsCopy)
    }
  }

  const loadedFoods = (
    results ? 
      results.map((result, i) => 
      <li key={i}>{result.name} 
        <ul>{result.nutrients.map((nutrient, j) => 
          <li key={j}>{nutrient.nutrient}: {nutrient.value}{nutrient.unit}</li>)}
        </ul>
      </li>) 
    : null
  )

  return (
    <>
      <div className="buttons-wrapper">
        <button onClick={() => addNewFieldset()}>Add Another Filter</button>
        <button onClick={() => clearAllFields()}>Clear All Fieldsets</button>
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
                {i > 0 ? <input type="submit" onClick={(e, i) => removeFieldset(e,i)} value="Remove Fieldset" /> : null}
              </div>
            )
          })}
        </div>
        <div className="buttons-wrapper">
          <input type="submit" value="Submit Query" /> 
          <button onClick={handleClearResults}>Clear Results</button>
          {/* TODO: Return key doesnt submit, but rather hits New filter btn */}
        </div>
      </form>
      <div>
        <Results loadedFoods={loadedFoods} isLoading={isLoading} notFound={notFound} errors={errors} />
      </div>
    </>
  )

}

export default Form;