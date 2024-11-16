import './App.css';
import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ReadTrips from './pages/ReadTrips'
import EditTrip from './pages/EditTrip'
import CreateDestination from './pages/CreateDestination';
import ReadDestinations from './pages/ReadDestinations'
import TripDetails from './pages/TripDetails'
import PlanTrip from './pages/PlanTrip'
import Navigation from './components/Navigation'
import CreateActivity from './pages/CreateActivity';
import AddToTrip from './pages/AddToTrip';
import './App.css';
import './index.css';



const App = () => {

  // const [trips, setTrips] = useState([]);

  // useEffect(() => {
  //   const fetchTrips = async () => {
  //     const response = await fetch('/api/trips')
  //     const data = await response.json()
  //     setTrips(data)
  //   }

  //   fetchTrips()
  // }, [])

  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element:<Home/>
    },
    // {
    //   path: "/trips",
    //   element:<ReadTrips data={trips} />
    // },
    {
      path: '/planYourTrip',
      element: <PlanTrip />
    },
    // {
    //   path:"/trip/edit/:id",
    //   element: <EditTrip data={trips} />
    // },
    //{
    //  path:"/destinations",
    //  element: <ReadDestinations data={destinations} />
    //},
    // {
    //   path:"/trip/get/:id",
    //   element: <TripDetails data={trips} />
    // },
    {
      path:"/destination/new/:trip_id",
      element: <CreateDestination />
    },
    {
      path:"/activity/create/:trip_id",
      element: <CreateActivity />
    },
    // {
    //   path:"/destinations/add/:destination_id",
    //   element: <AddToTrip data={trips}/>
    // },
    {
      path: "*", // invalid URL
      element: <NotFound />
    }
  ]);

  return (
    <div className='app'>
      <Navigation />
      { element }
    </div>
  )
}

export default App