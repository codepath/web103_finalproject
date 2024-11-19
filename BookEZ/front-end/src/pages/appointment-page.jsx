import "../css/appointment-page.css";
import { useEffect, useState } from "react";
// import employees from "../data/employees-mock-data";
import { useParams } from "react-router-dom";
// import employeeTimeSlots from "../data/employee-appointment";
import {
  bookThisTimeslot,
  getAnEmployeeById
} from "../services/employeeAPI";
import { reserveThisTimeSlot, getTimeslotsOfEmployeeByIdAndDate } from "../services/timeslotAPI";

import dayjs from "dayjs";
import { StaticDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";

const AppointmentPage = ({ currentUserId }) => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [employeeId, setEmployeeId] = useState();
  const [SalonId, setSalonId] = useState();
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [errorEmployee, setErrorEmployee] = useState("");
  const [reservedOnce, setReservedOnce] = useState(false);

  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlotId, setTimeSlotId] = useState();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(true);
  const [errorTimeSlots, setErrorTimeSlots] = useState("");

  // const [filteredTimeSlots, setFilteredTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // const [selectedDay, setSelectedDay] = useState("");
  const [formattedDate, setFormattedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const { eid } = useParams();

  // Get employee information
  useEffect(() => {
    const getAnEmployee = async () => {
      setLoadingEmployee(true);
      try {
        const employee = await getAnEmployeeById(eid);
        setEmployeeName(employee.name);
        setEmployeeRole(employee.role);
        setEmployeeId(employee.id);
        setSalonId(employee.salon_id);
        // console.log(employee);
        // setEmployeeList(employees);
      } catch (err) {
        setErrorEmployee("Failed to fetch this employee for this salon!");
      } finally {
        setLoadingEmployee(false);
      }
    };

    getAnEmployee();
  }, [eid]);

  const reserveAppointment = async () => {
    alert(
      "You reserved timeslot " +
        selectedTimeSlot +
        " for worker " +
        employeeName
    );

    const timeSlotBody = {
      user_id: currentUserId,
      salon_id: SalonId,
      employee_id: employeeId,
      time_slot_id: timeSlotId
    }

    try {
      await bookThisTimeslot(timeSlotBody);
      await reserveThisTimeSlot(timeSlotId);
      console.log("Booking added successfully", timeSlotBody);
      setReservedOnce(true);

      getTimeslotdAndFilterByTime(eid, formattedDate);
    } catch (error) {
      console.error("Error adding booking", error);
    }
  };

  const getTimeslotdAndFilterByTime = async (eid, date) => {
    // setSelectedTimeSlot("");
    setLoadingTimeSlots(true);
    // console.log(`Here is the date ${date}||`)
    try {
      const timeSlotList = await getTimeslotsOfEmployeeByIdAndDate(eid, date);
      // console.log(timeSlotList);
      setTimeSlots(timeSlotList);
      setFormattedDate(date);
    } catch (err) {
      setErrorTimeSlots("Failed to fetch this employee for this salon!");
    } finally {
      setLoadingTimeSlots(false);
    }
  }

  useEffect(() => {
    getTimeslotdAndFilterByTime(eid, formattedDate);
  }, [eid, formattedDate, reservedOnce])

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    // filterTimeSlotsByDate(timeSlots, newDate);
    // Format as YYYY-MM-DD
    // setFormattedDate(formatted);
    const formatted = newDate.format("YYYY-MM-DD"); 
    // console.log("Selected Date:", formatted.trim());
    getTimeslotdAndFilterByTime(eid, formatted);
  };

  return (
    <>
      <div className="appointment-page-employee-details">
        {
          loadingEmployee 
          ?
          <h3>Loading employee list...</h3>
          : errorEmployee ?
          <h3>Loading employee list error!!</h3>
          :
          <>
            <h1>{employeeName}</h1>
            <h3>{employeeRole}</h3>
          </>
        }
      </div>
      
      <div className="appointment-reservation">
        <div className="list-of-timeSlot">
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
              orientation="landscape"
            />
          </LocalizationProvider>
        </div>

        <div className="reserve-a-timeSlot">
          {loadingTimeSlots 
            ? 
            <h3>Loading time slots...</h3>
            : errorTimeSlots ? 
            <h3>Fetching time slots error!!</h3>
            : timeSlots.length === 0 ? 
            <h3><i>{employeeName} has no schedule on {formattedDate}!</i></h3>
            :
            <div className="time-slot-frame">
              <div className="time-slot-box">
                {timeSlots.map((timeslot, index) => (
                  <div
                    className= {timeslot.is_booked ? "timeslot timeslot-booked" : "timeslot"}
                    key={index}
                    onClick={() => {setSelectedTimeSlot(`${timeslot.start_time} - ${timeslot.end_time}`); console.log(timeslot); setTimeSlotId(timeslot.id)}}
                  >
                    {`${timeslot.start_time.substring(11, 16)} - ${timeslot.end_time.substring(11, 16)}`}
                  </div>
                ))}
              </div>

              <h4 style={{ marginBottom: "15px" }}>Your selected time slot is:</h4>
              <input
                type="text"
                className="input-box"
                value={selectedTimeSlot}
                unselectable="true"
              />
              <button className="button-info" onClick={() => reserveAppointment()}>
                Reserve
              </button>
              
              <div className="timeslot-note">
                <div
                  className= "timeslot-note-box timeslot-booked"
                >
                  15:30 - 16:00
                </div>

                <h4 className="timeslot-note-guide">The timeslot is already booked!</h4>
              </div>

              <div className="timeslot-note">
                <div
                  className= "timeslot-note-box"
                >
                  15:30 - 16:00
                </div>
                <h4 className="timeslot-note-guide">The timeslot is not yet booked!</h4>
              </div>
            </div>
          }
         
        </div>
      </div>
    </>
  );
};

export default AppointmentPage;