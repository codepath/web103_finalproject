import eggs from '../assets/eggs.jpg'


const Ingredient = () => {
  return (
    <div style={styles.container}>
      <img style={styles.img} src={eggs} />
      <section>
        <h1>Ingredient Name</h1>
        <p>Qty: </p>
        <p>Category: </p>
      </section>

    </div>
  )
}

export default Ingredient

const styles = {
  container: {
    display: 'flex',
    border: 'solid black',
    borderRadius: '10px',
    alignItems: 'center',
    padding: '10px',
    gap: 20,
  },
  img: {
    display: "block",
    width: '100px',
    height: '100px',
    borderRadius: '10px',
    margin: '0 auto',
  }
}
