// import react from 'react'
import api from "../services/api.jsx"
import toSteps from "../utils/steps.js"
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

// pg returns NUMERIC columns as strings ("2.00"), so trim the trailing zeros
const formatQuantity = (quantity) => {
  if (quantity === null || quantity === undefined) return ''
  return String(Number(quantity))
}

const Recipe = () => {
  const [recipe, setRecipe] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [copied, setCopied] = useState(false)
  const params = useParams()

  useEffect(() => {
    const loadRecipe = async () => {
      const data = await api.getRecipe(params.id)
      setRecipe(data)

      const recipeIngredients = await api.getRecipeIngredients(params.id)
      setIngredients(recipeIngredients)
    }

    loadRecipe()
  }, [params.id])

  const steps = toSteps(recipe?.instructions)

  const copyInstructions = async () => {
    // number the steps so they stay readable once pasted somewhere else
    const text = steps.map((step, index) => `${index + 1}. ${step}`).join('\n')

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h1>{recipe?.title}</h1>
      <div style={styles.descrBox}>
        {/* <h1>Description</h1> */}
        <div style={styles.imgBox}>
          <img style={styles.img} src={recipe?.image_url}/>
        </div>
        <div style={styles.infoBox}>
          <hr />
          <p>{recipe?.description}</p>
          <hr />
        </div>
      </div>
      <div style={styles.recipeBox}>

        <div style={styles.ingrBox}>
          <h1>Ingredients</h1>
          <div style={styles.innerIngr}>
            {ingredients.length === 0 && (
              <p style={styles.empty}>No ingredients listed for this recipe.</p>
            )}
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} style={styles.ingrRow}>
                <span>{ingredient.name}</span>
                <span style={styles.amount}>
                  {formatQuantity(ingredient.quantity)} {ingredient.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.dirBox}>
          <div style={styles.dirHeader}>
            <h1>Directions</h1>
            {steps.length > 0 && (
              <button
                onClick={copyInstructions}
                style={styles.copyBtn}
                title="Copy instructions"
                aria-label="Copy instructions"
              >
                <svg
                  viewBox="0 0 24 24"
                  style={styles.copyIcon}
                  fill="none"
                  stroke={copied ? '#2e7d32' : '#444444'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {copied ? (
                    <path d="M20 6 9 17l-5-5" />
                  ) : (
                    <>
                      <rect x="9" y="9" width="11" height="11" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </>
                  )}
                </svg>
                <span style={copied ? styles.copiedText : styles.copyText}>
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>
            )}
          </div>
          <div style={styles.innerDir}>
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
    </div>
  )
}

export default Recipe

const styles = {
  recipeBox: {
    display: 'flex',
    gap: 10,
    width: '90%',
    // border: 'solid black',
    // padding: '20px',
    boxSizing: 'border-box',
    marginLeft: '10px',
  },
  descrBox: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 60,
    marginLeft: '2px',
    fontSize: '20px',
    // border: 'solid black',
    // borderRadius: '10px',
    // borderWidth: '1px',
    // paddingLeft: '5px',
    padding: '10px',
  },
  ingrBox: {
    width: '45%',
    marginRight: '10px',
  },
  dirBox: {
    width: '45%',
  },
  innerIngr: {
    display: 'flex',
    flexDirection: 'column',
    border: 'solid black',
    borderWidth: '1px',
    borderRadius: '10px',
    width: '100%',
    height: '500px',
    padding: '10px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  innerDir: {
    display: 'flex',
    flexDirection: 'column',
    border: 'solid black',
    borderWidth: '1px',
    borderRadius: '10px',
    width: '100%',
    height: '500px',
    padding: '10px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  ingrRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '18px',
    padding: '8px 4px',
    borderBottom: '1px solid #ddd',
  },
  amount: {
    fontWeight: '700',
  },
  dirHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
  },
  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'solid black',
    borderWidth: '1px',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
  copyIcon: {
    width: '18px',
    height: '18px',
    display: 'block',
  },
  copyText: {
    fontSize: '16px',
    color: '#444444',
  },
  copiedText: {
    fontSize: '16px',
    color: '#2e7d32',
    fontWeight: '700',
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
  img: {
    display: 'block',
    width: '200px',
  },
  imgBox: {
    border: 'solid black',
    borderWidth: '1px',
    borderRadius: '10px',
    padding: '10px',
  },
  infoBox: {
    // border: 'solid black',
    // borderWidth: '1px',
    // borderRadius: '10px',
    // padding: '10px',
  },

}
