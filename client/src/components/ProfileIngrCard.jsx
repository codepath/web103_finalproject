import { Link } from 'react-router-dom'
import heart from '../assets/heart.png'
import favoritesApi from '../services/favoritesApi.js'
import trash from '../assets/trash-icon.svg'

function Card ({id, title, stars, image_url, avg_rating, refresh}) {

  const deleteFavorite = (recipe_id) => {
     
    favoritesApi.deleteFavorite(recipe_id)
    refresh(recipe_id)
  }

  return (
    <div style={styles.container}>
      <Link to={`/recipe/${id}`}>
        <img src={image_url} style={styles.img} />
      </Link>
      <h1 style={styles.title}>{title}</h1>
      <div style={styles.interBox}>
        {/* <img style={styles.starImage} src={star_img} /> */}
        {/* <button>{heart}</button> */}
        <text>{avg_rating} stars</text>
        <button 
          onClick={() => deleteFavorite(id)}
          style={styles.button}
        >
          <img src={trash} alt="Favorite" style={styles.heart} />
        </button>
      </div>
      {/* <Link to={`/recipe/${id}`} style={styles.btn}>Recipe</Link> */}
    </div>
  )
}

export default Card;

const styles = {
  container: {
    width: '240px',
    height: '250px',
    border: 'solid black',
    borderRadius: '10px',
    margin: '0 auto',
    marginBottom: '30px',
    padding:'10px',
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
  },
  title: {
    fontSize: '20px',
    textDecoration: 'none',
    color: 'black',
  },
  img: {
    display: 'block',
    // width: '150px',
    width: '200px',
    height: '150px',
    // width: '80%',
    borderRadius: '10px',
    margin: '0 auto',
    marginTop: '5px',
    marginBottom: '5px',
  },
  btn:{
    display:'block',
    width: '40%',
    textAlign: 'center',
    margin: '0 auto',
    border: 'solid black',
    borderWidth: '1px',
    padding: '15px',
    borderRadius: '10px',
    fontSize: '20px',
    fontWeight: '700',
    color: 'black',
    textDecoration: 'none',
  },
  starImage: {
    width: '40%',
    display: 'block',
  },
  interBox: {
    // border: 'solid black',
    display: 'flex',
    justifyContent: "space-between",
    marginTop: 'auto',
    alignItems: 'center',
    color: 'black',
    fontSize: '20px',
  },
  heart: {
    width: "20px",
    height: "20px",
    display: "block",
  },
}
