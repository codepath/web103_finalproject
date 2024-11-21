import '../../css/salon-page.css'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import EmployeeBox from './employee-box'
import { getEmployeesBySalonId, getSalonById } from '../../services/salonAPI'

import PlaceIcon from '@mui/icons-material/Place'

import MailRoundedIcon from '@mui/icons-material/MailRounded'
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded'

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const SalonPage = () => {
  let { id } = useParams()
  const [salonName, setSalonName] = useState('')
  // const [salonAddress, setAddress] = useState("");
  // const [salonCity, setCity] = useState("");
  // const [salonState, setState] = useState("");
  // const [salonZipCode, setZipCode] = useState("");
  const [salonPhoneNumber, setPhoneNumber] = useState('')
  const [salonEmail, setEmail] = useState('')
  const [salonFullAddress, setSalonFullAddress] = useState('')

  const [loadingPage, setLoadingPage] = useState(true)
  const [errorPage, setErrorPage] = useState('')
  const [loadingEmployee, setLoadingEmployee] = useState(true)
  const [errorEmployee, setErrorEmployee] = useState('')

  const [employeeList, setEmployeeList] = useState([])

  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const fetchSalonDetails = async () => {
      setLoadingPage(true)
      try {
        const salon = await getSalonById(id)
        setSalonName(salon.name)
        // setAddress(salon.address);
        // setCity(salon.city);
        // setState(salon.state);
        // setZipCode(salon.zip_code);
        setPhoneNumber(salon.phone_number)
        setEmail(salon.email)

        setSalonFullAddress(
          `${salon.address}, ${salon.city}, ${salon.state} ${salon.zip_code}`
        )
      } catch (err) {
        setErrorPage("Failed to fetch this salon's details")
      } finally {
        setLoadingPage(false)
        // console.log(process.env.GGLOCATIONAPIKEY);
      }
    }

    fetchSalonDetails()
  }, [id])

  useEffect(() => {
    const getAllEmployees = async () => {
      setLoadingEmployee(true)
      try {
        const employees = await getEmployeesBySalonId(id)
        setEmployeeList(employees)
      } catch (err) {
        setErrorEmployee('Failed to fetch employees for this salon!')
      } finally {
        setLoadingEmployee(false)
      }
    }

    getAllEmployees()
  }, [id])

  const viewInGoogleMap = () => {
    // console.log(process.env.GGLOCATIONAPIKEY);
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      salonFullAddress
    )}&key=${process.env.GGLOCATIONAPIKEY}`

    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'OK') {
          const location = data.results[0].geometry.location
          const latitude = location.lat
          const longitude = location.lng
          const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
          window.open(googleMapsUrl, '_blank')
        }
        // else {
        //     alert("Address not found: " + data.status);
        // }
      })
      .catch((error) => {
        alert('Error: ' + error.message)
      })
  }

  return (
    <>
      <div className="salon-page-salon-details">
        {loadingPage ? (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        ) : errorPage ? (
          <h2>{errorPage}</h2>
        ) : (
          <>
            <h1>{salonName}</h1>
            <h3
              className="salon-details sd-address sd-info-icon"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => viewInGoogleMap()}
            >
              <PlaceIcon />
              {salonFullAddress || 'Loading address...'}
            </h3>
            {hovered && (
              <div className="tooltip">This is a tooltip with guidance!</div>
            )}

            <h3 className="salon-details sd-mail sd-info-icon">
              <PhoneInTalkRoundedIcon />
              Phone: {salonPhoneNumber}
            </h3>
            <a
              href="mailto:thanhnguyen14.gers@gmail.com?subject=Message%20to%20Thanh%20Nguyen"
              className="salon-details sd-mail sd-info-icon"
            >
              <MailRoundedIcon />
              Email: {salonEmail}
            </a>
          </>
        )}
      </div>

      {loadingEmployee ? (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      ) : errorEmployee ? (
        <h2>{errorEmployee}</h2>
      ) : (
        <>
          <h1>List of Employees</h1>
          <h3>
            <i>Book your favorite hairdresser or manicurist here</i>
          </h3>
          <div className="salon-page-salon-list-of-employees">
            {employeeList.length > 0 ? (
              employeeList.map((employee) => (
                <EmployeeBox key={employee.id} employee={employee} />
              ))
            ) : (
              <h2>No employees available for this salon</h2>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default SalonPage
