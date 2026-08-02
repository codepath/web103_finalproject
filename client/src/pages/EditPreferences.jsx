import { useState, useEffect } from 'react'
// import userApi from '../services/userApi.jsx'
import preferenceApi from '../services/preferenceApi.js'
import PrefItem from '../components/PrefItem.jsx'

const EditPreferences = ({ toggle, delRefresh, inRefresh}) => {
  const [preferences, setPreferences] = useState([]) 
  const [newPref, setNewPref] = useState({ preference: ''})

  const handleChange = (event) => {
    const { name, value } = event.target

    setNewPref( (prev) => {
      return {
        ...prev,
        [name]:value,
      }
    })
  }

  const handleModalDeleteRefresh = (id) => {
    setPreferences(prev =>
      prev.filter(preference => preference.id !== id)
    )
    console.log('delete modal refreshing')
  }

  useEffect(() => {
    const fetchPreference = async () => {
      const data = await preferenceApi.getPreferences()
      setPreferences(data)
    }
    fetchPreference()
  }, [])

  const createPreference = (event) => {
    event.preventDefault()

    preferenceApi.createPreference(newPref)
    setPreferences(prev => [
      ...prev,
      newPref
    ])
    inRefresh(newPref)
  }

  return (
    <div style={styles.editPicker}>
      <h1 style={styles.title}>Preferences</h1>
      <div style={styles.prefBox}>
        {preferences.map((p) => (
          <PrefItem
            key={p.id}
            id={p.id}
            preference={p.preference}
            onChange={handleChange}
            delRefresh={delRefresh}
            delModalRefresh={handleModalDeleteRefresh}
          ></PrefItem>
        ))}
      </div>
      <div style={styles.bottomBox}>
        <div style={styles.addBox}>
          <input 
            style={styles.input}
            name='preference'
            value={newPref.preference}
            onChange={handleChange}
          />
          <button 
            type="submit"
            style={styles.addBtn}
            onClick={createPreference}
          >Add</button>
        </div>
        <button onClick={toggle} style={styles.btn}>Exit</button>
      </div>
    </div>
  )
}

export default EditPreferences

const styles = {
  title: {
    // marginLeft: '20px',
    textAlign: 'center',
  },
  addBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    // border: 'solid black',
  },
  input: {
    display: 'block',
    width: '100px',
    height: '35px',
  },
  editPicker: {
    // margin: '0 auto',
    position: 'absolute',
    // padding: '30px',
    width: '80%',
    top: '5%',
    left: '10%',
    border: 'solid black',
    borderRadius: '15px',
    borderWidth: '1px',
    backgroundColor: '#f3f3f3',
  },
  bottomBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box',
    // border: 'solid black',
    // paddingLeft: '10px',
    // paddingRight: '10px',
  },
  prefBox: {
    display:'flex',
    flexWrap: 'wrap',
    margin: '10px',
    zIndex: '100',
  },
  addBtn: {
    fontSize:'15px',
    textDecoration: 'none',
    color: 'black',
    cursor: 'pointer',
    height: '35px',
    width: '55px',
    alignText: 'center',
    border: 'solid black',
    borderRadius: '5px',
    borderWidth:'1px',
    padding: '10px',
  },
  btn: {
    fontSize:'15px',
    // marginRight: '25px',
    // marginTop: '25px',
    textDecoration: 'none',
    color: 'black',
    cursor: 'pointer',
    height: '35px',
    width: '55px',
    alignText: 'center',
    border: 'solid black',
    borderRadius: '5px',
    borderWidth:'1px',
    padding: '10px',

  },
}
