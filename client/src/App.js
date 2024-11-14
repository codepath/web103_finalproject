import './App.css';
import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom'
import Home from './pages/Home'
import ReadTrips from './pages/ReadTrips'
import CreateTrip from './pages/CreateTrip'
import EditTrip from './pages/EditTrip'
import CreateDestination from './pages/CreateDestination';
import ReadDestinations from './pages/ReadDestinations'
import TripDetails from './pages/TripDetails'
import { Link } from 'react-router-dom'
import CreateActivity from './pages/CreateActivity';
import AddToTrip from './pages/AddToTrip';
import Logo from './assets/Logo.png';
import email_icon from './assets/email_icon.png';
import instagram_icon from './assets/instagram_icon.png';
import whatsapp_icon from './assets/whatsapp_icon.png';
import heart_icon from './assets/heart_icon.png';
import profile_icon from './assets/profile_icon.png';


const App = () => {

  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const response = await fetch('/api/trips')
      const data = await response.json()
      setTrips(data)
    }

    fetchTrips()
  }, [])

  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element:<Home/>
    },
    {
      path: "/trips",
      element:<ReadTrips data={trips}/>
    },
    {
      path:"/trip/new",
      element: <CreateTrip />
    },
    {
      path:"/trip/edit/:id",
      element: <EditTrip data={trips} />
    },
    {
      path:"/destinations",
      element: <ReadDestinations data={destinations} />
    },
    {
      path:"/trip/get/:id",
      element: <TripDetails data={trips} />
    },
    {
      path:"/destination/new/:trip_id",
      element: <CreateDestination />
    },
    {
      path:"/activity/create/:trip_id",
      element: <CreateActivity />
    },
    {
      path:"/destinations/add/:destination_id",
      element: <AddToTrip data={trips}/>
    }
  ]);


  return (

    <div className="App">

      <div className="header">
        <div className="home_page">
            <div className='ribbon'>
                <div className = 'icons'>
                    <img src={instagram_icon}/><div className="text" >tripotrail_find_me</div>
                    <img src={whatsapp_icon}/><div className="text" >+1-404-987-999</div>
                    <img src={email_icon}/><div className="text" >support@tripotrail.com</div>
                </div>
            </div>
            <div className='main_page'>
                <div className='logo'>
                    <img src={Logo} alt="Logo" />
                </div>
                <div className="nav-header">
                    <div className="nav-buttons">
                        <a href='/' role='button'>Home</a>
                        <Link to="/trip/new">Plan your Trip</Link>
                        <Link to="/trips">My Trips</Link>
                        <a href='/destinations' role='button'>Destinations</a>
                        <a href='/about' role='button'>About</a>
                        <a href='/blog' role='button'>Blogs</a>
                        <a href='/contact' role='button'>Contact</a>
                        <div className = 'nav-icons'>
                            <img src={heart_icon}/>
                            <img src={profile_icon}/>
                        </div>
                    </div>
                </div>
            </div>
            </div>

      </div>
        {element}
    </div>

  );
}

export default App;
