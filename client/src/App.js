import './App.css';
import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom'
import ReadSneakers from './pages/ReadSneakers'
import SneakerDetails from './pages/SneakerDetails'
import CreateComment from './pages/CreateComment'
import About from './pages/About'
import PageNotFound from './pages/PageNotFound'


const App = () => {
  
  const [sneakers, setSneakers] = useState([]);

  useEffect(() => {
    const fetchSneakers = async () => {
      const response = await fetch('/api/sneakers')
      const data = await response.json()
      setSneakers(data)
    }
  
    fetchSneakers()
  }, []);

  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element:<ReadSneakers data={sneakers}/>
    },
    {
      path: "/sneaker/get/:id",
      element:<SneakerDetails data={sneakers}/>
    },
    {
      path:"/reviews/create/:sneaker_id",
      element: <CreateComment />
    },
    {
      path:"/about",
      element: <About />
    },
    {
      path:"/*",
      element: <PageNotFound />
    }
  ]);

  
  return ( 

    <div className="App">
        {element}
    </div>

  );
}

export default App;

