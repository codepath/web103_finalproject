import api from "../services/api.jsx"
import toSteps from "../utils/steps.js"
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const Instructions = () => {
  const [recipe, setRecipe] = useState({})
  const params = useParams()

  useEffect(() => {
    const loadRecipe = async () => {
      const data = await api.getRecipe(params.id)
      setRecipe(data)
    }

    loadRecipe()
  }, [params.id])

  const steps = toSteps(recipe?.instructions)

  return (
    <div>
      <h1>{recipe?.title}</h1>
      <div style={styles.topBox}>
        <Link to="/home" style={styles.back}>Back to Home</Link>
      </div>
      <div style={styles.stepsBox}>
        <h1>Directions</h1>
        <div style={styles.innerSteps}>
          {steps.length === 0 && (
            <p style={styles.empty}>No instructions listed for this recipe.</p>
          )}
          <ol style={styles.list}>
            {steps.map((step, index) => (
              <li key={index} style={styles.step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default Instructions

const styles = {
  topBox: {
    marginLeft: '10px',
    marginBottom: '10px',
  },
  back: {
    display: 'inline-block',
    border: 'solid black',
    borderWidth: '1px',
    borderRadius: '10px',
    padding: '10px 15px',
    fontSize: '18px',
    fontWeight: '700',
    color: 'black',
    textDecoration: 'none',
  },
  stepsBox: {
    width: '90%',
    marginLeft: '10px',
    boxSizing: 'border-box',
  },
  innerSteps: {
    border: 'solid black',
    borderWidth: '1px',
    borderRadius: '10px',
    width: '100%',
    padding: '10px',
    boxSizing: 'border-box',
  },
  list: {
    paddingLeft: '25px',
    margin: 0,
  },
  step: {
    fontSize: '18px',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  empty: {
    fontSize: '18px',
    color: '#666',
  },
}