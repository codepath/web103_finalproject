import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.jsx'

const AddIngredient = () => {
  const [ingredient, setIngredient] = useState({
    name: '',
    category: '',
    calories: '',
    dietary_tags: '',
    quantity: '',
    unit: ''
  });

  const categories = [
    'category',
    'pantry',
    'fridge',
    'freezer',
    'cabinet',
    'counter',
    'drawer',
    'shelf',
    'spice rack'
  ]

  const handleChange = (event) => {
    const {name, value} = event.target
    setIngredient((prev) => {
      return {
        ...prev,
        [name]:value
      }
    })
  }

  const navigate = useNavigate()

  const handleCancel = (event) => {
    navigate('/kitchen')
  }

  const addIngredient = (event) => {
    event.preventDefault()

    api.addToKitchen(ingredient)
  }

  return (
    <div>
      <h1 style={styles.title}>Add Ingredient</h1>
      <div style={styles.formContainer}>
        <form>
          <label htmlFor="name">
            Ingredient Name:    
          </label>
          <input 
            id='name'
            name='name'
            type="text"
            value={ingredient.name}
            onChange={handleChange}
            style={styles.input}
          />
          <br />
          <label htmlFor="name">
            Categories:    
          </label>
          <select
            id='category'
            name='category'
            value={ingredient.category}
            onChange={handleChange}
            style={styles.input}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <br />
          <label htmlFor="calories">
            Calories:    
          </label>
          <input 
            id='calories'
            name='calories'
            type="number"
            min ="0"
            value={ingredient.calories}
            onChange={handleChange}
            style={styles.input}
          />
          <br />
          <label htmlFor="dietary_tag">
            Nutritional / Dietary Info:
          </label>
          <textarea
            id='dietary_tags'
            name='dietary_tags'
            value={ingredient.dietary_tags}
            onChange={handleChange}
            style={styles.textInput}
          />
          <br />
          <label htmlFor="quantity">
            Quantity:
          </label>
          <input
            id='quantity'
            name='quantity'
            type="number"
            min="0"
            value={ingredient.quantity}
            onChange={handleChange}
            style={styles.input}
          />
          <br />
          <label htmlFor="unit">
            Unit:
          </label>
          <input
            id='unit'
            name='unit'
            type="text"
            placeholder="e.g. lbs, oz, cups"
            value={ingredient.unit}
            onChange={handleChange}
            style={styles.input}
          />
          <div style={styles.btnBox}>
            <button 
              type="submit"
              style={styles.btn1}
              onClick={addIngredient}
            >Save</button>
            <button 
              type="submit"
              style={styles.btn2}
              onClick={handleCancel}
            >Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddIngredient

const styles = {
  title: {
    display: 'block',
    fontSize: '30',
    marginBottom: '1px',
    // textAlign: 'center',
    // margin: '0 auto',
  },
  formContainer: {
    border: 'solid black',
    backgroundColor: '#fafafa',
    borderRadius: '15px',
    display: 'flex',
    padding: '20px',
    // justifyContent: 'center',
    fontWeight: 'bold',
    width: '700px',
    // margin: '0 auto',
    marginTop: '0px',
  },
  input: {
    display: 'block',
    // border: 'solid black',
    width: '150px',
    height: '30px',
    borderRadius: '5px',
    
  },
  textInput: {
    display: 'block',
    // border: 'solid black',
    width: '600px',
    height: '250px',
    borderRadius: '5px',
    
  },
  btnBox: {
    display: 'flex',
    gap:'10px',
  },
  btn1: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    width: '150px',
    height: '50px',
    fontSize: '15px',
    fontWeight: 'bold',
    backgroundColor: '#333333',
    color: 'white',
    border: 'solid black',
    padding: '20px',
    borderRadius: '5px',
    borderWidth: '1px',
    textDecoration: 'none',
    // display: 'block',
    marginTop: '20px',
    marginRight: '20px',
  },
  btn2: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    width: '150px',
    height: '50px',
    fontSize: '15px',
    fontWeight: 'bold',
    color: 'black',
    border: 'solid black',
    padding: '20px',
    borderRadius: '5px',
    borderWidth: '1px',
    textDecoration: 'none',
    // display: 'block',
    marginTop: '20px',
    marginRight: '20px',
  },
}
