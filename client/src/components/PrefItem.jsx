import react from 'react'
import preferenceApi from '../services/preferenceApi.js'


const PrefItem = ({ id, preference, delRefresh, delModalRefresh }) => {

  const deletePreference = (id) => {

    preferenceApi.deletePreference(id)
    delRefresh(id, 'pref')
    delModalRefresh(id)
  }

  return (
    <>
      <div style={styles.prefItem}>
        <div key={id} style={styles.itemPref}>{preference}</div>
        <button
          style={styles.btn}
          onClick={() => deletePreference(id)}
        >Delete</button>
      </div>
      <hr style={styles.hr}/>
    </>
  )
}

export default PrefItem

const styles = {
  prefItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '20px',
    margin: '10px',
    width: '100%',
  },
  hr: {
    border: 'none',
    borderTop: '1px solid black',
    width: '98%',
  },
  itemPref: {
    textAlign: 'center',
    border: 'solid black',
    borderRadius: '15px',
    borderWidth: '1px',
    width: '125px',
    height: '30px',
    backgroundColor: '#dcdcdc',
  },
  itemTxt: {
    display: 'block',
  },
  btn: {
    textDecoration: 'none',
    color: 'black',
    cursor: 'pointer',
    height: '40px',
    width: '100px',
    border: 'solid black',
    borderRadius: '5px',
    borderWidth:'1px',
    padding: '10px',
    borderColor: 'red',
  }
}


