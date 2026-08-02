import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card.jsx'
import EditPreferences from './EditPreferences.jsx'
import preferenceApi from '../services/preferenceApi.js'
import favoritesApi from '../services/favoritesApi.js'
import api from "../services/api.jsx"
import ProfileIngrCard from '../components/ProfileIngrCard.jsx'

const Profile = ({ user }) => {
  const [editBox, setEditBox] = useState(false)
  const [preferences, setPreferences] = useState([]) 
  const [favorites, setFavorites] = useState([]) 
  const [recipes, setRecipes] = useState([]) 

  const toggle = () => {
    if (editBox === false) {
      setEditBox(true)
    } else if (editBox === true) {
      setEditBox(false)
    }
  }

  const handleInsertRefresh = (data) => {
    setPreferences(prev => [
      ...prev,
      data
    ])

    console.log('insert refreshing')
  }

  const handleDeleteRefresh = (id, type) => {
    if (type == 'fav') {
      setFavorites(prev =>
        prev.filter(favorite => favorite.recipe_id !== id)
      )
      setRecipes(prev =>
        prev.filter(recipe => recipe.id !== id)
      )
      console.log('delete fav refreshing')
    }
    if (type == 'pref') {
      setPreferences(prev =>
        prev.filter(preference => preference.id !== id)
      )
    }
    console.log('delete refreshing')
  }

  useEffect(() => {
    const fetchData = async () => {
      const dataP = await preferenceApi.getPreferences()
      setPreferences(dataP)

      const dataF = await favoritesApi.getFavorites()
      setFavorites(dataF)

      const recipePromises = dataF.map((favorite) => 
        api.getRecipe(favorite.recipe_id))

      const recipeData = await Promise.all(recipePromises)

      setRecipes(recipeData)
      // console.log(recipeData)
    }
    
    fetchData()
  }, [])

  return (
    <div style={styles.profileBox}>

      {editBox && (<EditPreferences 
        delRefresh={handleDeleteRefresh} 
        inRefresh={handleInsertRefresh}
        toggle={toggle}
      ></EditPreferences>)}

      <div style={styles.info}>
        <img src={user.avatarurl} style={styles.infoImg}/>
        <div>
          <p style={styles.username}>{user.username}</p>
          {/* <Link to='/edit/profile' style={styles.editBtn}>Edit Profile</Link> */}
          {/* <button style={styles.editBtn}>Edit Profile</button> */}
        </div>
      </div>

      <div style={styles.prefBox}>

        <div style={styles.innerPref}>
          <p style={styles.dietTitle}>Dietary Preferences</p>
          {/* <Link to='/edit/preferences' style={styles.editPrefBtn}>Edit Preferences</Link> */}
          <button onClick={toggle} style={styles.editPrefBtn}>Edit Preferences</button>
        </div>

        <div style={styles.prefs}>
          {
            preferences.map((p) => (
              <div key={p.id} style={styles.itemPref}>{p.preference}</div>
            ))
          }
        </div>

      </div>

      <div style={styles.kitchenBox}>
        <h1>My Kitchen</h1>
        <Link to='/kitchen' style={styles.kitchenLink}> View ➟</Link>
      </div>

      <p style={styles.favTitle}>Favorite Recipes</p>
      <div style={styles.favBox}>
        {recipes.map((r) => (
          <ProfileIngrCard
            key={r.id}
            id={r.id}
            title={r.title}
            image_url={r.image_url}
            avg_rating={r.avg_rating}
            refresh={handleDeleteRefresh}
          ></ProfileIngrCard>
        ))}

        {/* <Card></Card> */}
        {/* <Card></Card> */}
        {/* <Card></Card> */}
        {/* <Card></Card> */}
        {/* <Card></Card> */}
        {/* <Card></Card> */}
        {/* <Card></Card> */}
        {/* <Card></Card> */}
      </div>

    </div>
  )
}

export default Profile

const styles = {
  profileBox: {
    position: 'relative',
  },
  info: {
    display: 'flex',
    gap: 20,
    // border: 'solid black',
    padding: '10px',
    marginLeft: '10px',
    marginTop: '20px',

  },
  favBox: {
    display: 'flex',
    flexWrap: 'wrap',
    // margin: '10px',
    gap: 10,

  },
  prefBox: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between',
    border: 'solid black',
    borderRadius: '10px',
    padding: '10px',
    // height: '150px',
    marginTop: '20px',
    marginLeft: '10px',
  },
  kitchenBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '40px',
    paddingRight: '40px',
    border: 'solid black',
    borderRadius: '10px',
    height: '100px',
    marginTop: '20px',
    marginLeft: '10px',
  },
  prefs: { 
    display: 'flex',
    flexWrap: 'wrap',
    // alignItems: 'center',
    gap: 10,
    marginLeft: '30px',
    marginTop: '10px',
  },
  itemPref: {
    border: 'solid black',
    borderRadius: '15px',
    textAlign: 'center',
    fontSize: '20px',
    width: '125px',
    height: '30px',
    backgroundColor: '#dcdcdc',
  },
  innerPref: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    // padding: '15px',
  },
  infoImg: {
    display:'block',
    width: '100px',
    borderRadius: '50%',
  },
  username: {
    fontSize: '30px',
    marginBottom: '15px',
  },
  dietTitle: {
    display: 'block',
    fontSize: '25px',
    marginLeft: '20px',
  },
  favTitle: {
    fontSize: '25px',
    marginLeft: '20px',
  },
  editBtn: {
    textDecoration: 'none',
    color: 'black',
    cursor: 'pointer',
    height: '40px',
    width: '100px',
    border: 'solid black',
    borderRadius: '5px',
    borderWidth:'1px',
    padding: '10px',
    // marginRight: '25px',
    // marginTop: '10px',
  },
  editPrefBtn: {
    fontSize:'20px',
    marginRight: '25px',
    marginTop: '25px',
    textDecoration: 'none',
    color: 'black',
    cursor: 'pointer',
    height: '45px',
    width: '180px',
    border: 'solid black',
    borderRadius: '5px',
    borderWidth:'1px',
    padding: '10px',
  },
  kitchenLink: {
    fontSize: '25px',
    textDecoration: 'none',
    color: 'black',
  }

}
