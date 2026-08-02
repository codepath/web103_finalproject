import react from 'react'
import api from "../services/api.jsx"
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'

const Recipe = () => {
  const [recipe, setRecipe] = useState([])
  const params = useParams()

  useEffect(() => {
    const loadRecipe = async () => {
      const data = await api.getRecipe(params.id)
      setRecipe(data)
    }
    
    loadRecipe()
  }, [])

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
          <h1>Ingredience</h1>
          <div style={styles.innerIngr}>
            {/* {recipe.} */}
          </div>
        </div>

        <div style={styles.dirBox}>
          <h1>Directions</h1>
          <div style={styles.innerDir}>
            {recipe.instructions}
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
