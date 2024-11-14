import React, { useState, useEffect } from 'react';
import Card from '../components/Card';


const ReadGroups = (props) => {

    const [groups, setGroups] = useState([]);
    

    useEffect(() => {
        const fetchGroups = async () => {
          const response = await fetch('http://localhost:4000/api/groups')
          const data = await response.json()
          console.log(data)
          setGroups(data)
        }
      
        fetchGroups()
      }, [])
    
    return (
        <div className="d-flex flex p-3 gap-3">
            {
                groups && groups.length > 0 ?
                groups.map((group,index) => 
                   <Card key={group.id} 
                         id={group.id} 
                         name = {group.name}
                         description={group.description} 
                         created_by={group.created_by} />
                ) : <h3 className="noResults">{'No Groups Yet 😞'}</h3>
            }
        </div>  
    )
}

export default ReadGroups;